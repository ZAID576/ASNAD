import mongoose from 'mongoose';
import { Document } from '../models/Document.js';
import { Category } from '../models/Category.js';
import {
  uploadFileToUserDrive,
  getAuthenticatedDriveClient,
  ensureAsnadFolder,
  deleteFileFromUserDrive,
} from './googleDriveService.js';
import { logAudit } from './auditService.js';
import { invalidateDashboardCache } from './dashboardService.js';

export const uploadDocument = async ({ userId, file, categoryId = null }) => {
  // If categoryId provided, verify user owns the category
  if (categoryId) {
    const cat = await Category.findOne({ _id: categoryId, userId });
    if (!cat) categoryId = null;
  }

  // Upload file stream directly to user's Google Drive
  const driveResult = await uploadFileToUserDrive({
    userId,
    fileBuffer: file.buffer,
    fileName: file.originalname,
    mimeType: file.mimetype,
  });

  const doc = await Document.create({
    userId,
    categoryId: categoryId || null,
    name: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    driveFileId: driveResult.id,
    webViewLink: driveResult.webViewLink || '',
    sourceType: 'app_upload',
  });

  await logAudit({
    userId,
    action: 'DOCUMENT_UPLOADED',
    resourceType: 'Document',
    resourceId: doc._id,
    metadata: { fileName: doc.name, size: doc.size, driveFileId: doc.driveFileId },
  });

  return doc.populate('categoryId', 'name color icon');
};

export const completeDirectUpload = async ({
  userId,
  driveFileId,
  name,
  mimeType,
  size = 0,
  categoryId = null,
}) => {
  if (categoryId) {
    const cat = await Category.findOne({ _id: categoryId, userId });
    if (!cat) categoryId = null;
  }

  const doc = await Document.create({
    userId,
    categoryId: categoryId || null,
    name,
    mimeType: mimeType || 'application/octet-stream',
    size: size || 0,
    driveFileId,
    webViewLink: `https://drive.google.com/file/d/${driveFileId}/view?usp=drivesdk`,
    sourceType: 'app_upload',
  });

  await logAudit({
    userId,
    action: 'DOCUMENT_UPLOADED',
    resourceType: 'Document',
    resourceId: doc._id,
    metadata: { fileName: doc.name, size: doc.size, driveFileId: doc.driveFileId },
  });

  return doc.populate('categoryId', 'name color icon');
};

export const importFromPicker = async ({ userId, driveFileId, name, mimeType, size = 0, importType = 'drive_import_link', categoryId = null }) => {
  const { drive, connection } = await getAuthenticatedDriveClient(userId);

  let finalDriveFileId = driveFileId;
  let finalDriveFolderId = null;

  if (importType === 'drive_import_copy') {
    let folderId = connection.driveFolderId;
    if (!folderId) {
      folderId = await ensureAsnadFolder(drive);
      connection.driveFolderId = folderId;
      await connection.save();
    }

    // Copy file into user's Asnad folder
    const copied = await drive.files.copy({
      fileId: driveFileId,
      requestBody: {
        name,
        parents: [folderId],
      },
      fields: 'id, name, mimeType, size, webViewLink',
    });

    finalDriveFileId = copied.data.id;
    finalDriveFolderId = folderId;
  }

  if (categoryId) {
    const cat = await Category.findOne({ _id: categoryId, userId });
    if (!cat) categoryId = null;
  }

  const doc = await Document.create({
    userId,
    categoryId: categoryId || null,
    name,
    mimeType,
    size: size || 0,
    driveFileId: finalDriveFileId,
    driveFolderId: finalDriveFolderId,
    sourceType: importType,
  });

  await logAudit({
    userId,
    action: 'DOCUMENT_IMPORTED',
    resourceType: 'Document',
    resourceId: doc._id,
    metadata: { name, importType, driveFileId: finalDriveFileId },
  });

  return doc.populate('categoryId', 'name color icon');
};

export const listDocuments = async (userId, {
  page = 1,
  limit = 20,
  categoryId,
  search,
  isFavorite,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  includeTrash = false,
}) => {
  const query = {
    userId: new mongoose.Types.ObjectId(userId),
    deletedAt: (includeTrash === 'true' || includeTrash === true) ? { $ne: null } : null,
  };

  if (categoryId) {
    if (categoryId === 'uncategorized') {
      query.categoryId = null;
    } else {
      query.categoryId = new mongoose.Types.ObjectId(categoryId);
    }
  }

  if (isFavorite === 'true' || isFavorite === true) {
    query.isFavorite = true;
  }

  if (search && search.trim()) {
    query.name = { $regex: search.trim(), $options: 'i' };
  }

  const sortDirection = sortOrder === 'asc' ? 1 : -1;
  const sort = { [sortBy]: sortDirection };

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [documents, total] = await Promise.all([
    Document.find(query)
      .populate('categoryId', 'name color icon')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Document.countDocuments(query),
  ]);

  return {
    documents: documents.map((doc) => ({
      id: doc._id,
      name: doc.name,
      mimeType: doc.mimeType,
      size: doc.size,
      category: doc.categoryId
        ? {
            id: doc.categoryId._id,
            name: doc.categoryId.name,
            color: doc.categoryId.color,
            icon: doc.categoryId.icon,
          }
        : null,
      sourceType: doc.sourceType,
      isFavorite: doc.isFavorite,
      webViewLink: doc.webViewLink,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })),
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      hasNext: pageNum * limitNum < total,
      hasPrev: pageNum > 1,
    },
  };
};

export const getDocumentById = async (userId, documentId) => {
  const doc = await Document.findOne({ _id: documentId, userId })
    .populate('categoryId', 'name color icon')
    .lean();

  if (!doc) {
    const error = new Error('Document not found or access denied');
    error.statusCode = 404;
    error.code = 'DOCUMENT_NOT_FOUND';
    throw error;
  }

  invalidateDashboardCache(userId);

  return {
    id: doc._id,
    name: doc.name,
    mimeType: doc.mimeType,
    size: doc.size,
    category: doc.categoryId
      ? {
          id: doc.categoryId._id,
          name: doc.categoryId.name,
          color: doc.categoryId.color,
          icon: doc.categoryId.icon,
        }
      : null,
    driveFileId: doc.driveFileId,
    sourceType: doc.sourceType,
    isFavorite: doc.isFavorite,
    deletedAt: doc.deletedAt,
    webViewLink: doc.webViewLink,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

export const updateDocument = async (userId, documentId, { name, categoryId }) => {
  const doc = await Document.findOne({ _id: documentId, userId });
  if (!doc) {
    const error = new Error('Document not found');
    error.statusCode = 404;
    error.code = 'DOCUMENT_NOT_FOUND';
    throw error;
  }

  if (name && name.trim()) {
    doc.name = name.trim();
  }

  if (categoryId !== undefined) {
    if (categoryId === null || categoryId === '') {
      doc.categoryId = null;
    } else {
      const cat = await Category.findOne({ _id: categoryId, userId });
      if (cat) {
        doc.categoryId = cat._id;
      }
    }
  }

  await doc.save();
  await doc.populate('categoryId', 'name color icon');

  await logAudit({
    userId,
    action: 'DOCUMENT_UPDATED',
    resourceType: 'Document',
    resourceId: doc._id,
    metadata: { name: doc.name, categoryId: doc.categoryId },
  });

  return doc;
};

export const toggleFavorite = async (userId, documentId) => {
  const doc = await Document.findOne({ _id: documentId, userId });
  if (!doc) {
    const error = new Error('Document not found');
    error.statusCode = 404;
    error.code = 'DOCUMENT_NOT_FOUND';
    throw error;
  }

  doc.isFavorite = !doc.isFavorite;
  await doc.save();
  invalidateDashboardCache(userId);

  return { id: doc._id, isFavorite: doc.isFavorite };
};

export const moveToTrash = async (userId, documentId) => {
  const doc = await Document.findOne({ _id: documentId, userId });
  if (!doc) {
    const error = new Error('Document not found');
    error.statusCode = 404;
    error.code = 'DOCUMENT_NOT_FOUND';
    throw error;
  }

  doc.deletedAt = new Date();
  await doc.save();
  invalidateDashboardCache(userId);

  await logAudit({
    userId,
    action: 'DOCUMENT_MOVED_TO_TRASH',
    resourceType: 'Document',
    resourceId: doc._id,
  });

  return true;
};

export const restoreFromTrash = async (userId, documentId) => {
  const doc = await Document.findOne({ _id: documentId, userId });
  if (!doc) {
    const error = new Error('Document not found');
    error.statusCode = 404;
    error.code = 'DOCUMENT_NOT_FOUND';
    throw error;
  }

  doc.deletedAt = null;
  await doc.save();
  invalidateDashboardCache(userId);

  await logAudit({
    userId,
    action: 'DOCUMENT_RESTORED',
    resourceType: 'Document',
    resourceId: doc._id,
  });

  return true;
};

export const listTrash = async (userId) => {
  const documents = await Document.find({
    userId,
    deletedAt: { $ne: null },
  })
    .populate('categoryId', 'name color icon')
    .sort({ deletedAt: -1 })
    .lean();

  return documents.map((doc) => ({
    id: doc._id,
    name: doc.name,
    mimeType: doc.mimeType,
    size: doc.size,
    category: doc.categoryId
      ? {
          id: doc.categoryId._id,
          name: doc.categoryId.name,
          color: doc.categoryId.color,
        }
      : null,
    sourceType: doc.sourceType,
    deletedAt: doc.deletedAt,
    createdAt: doc.createdAt,
  }));
};

export const permanentDeleteDocument = async (userId, documentId, deleteDriveOriginal = false) => {
  const doc = await Document.findOne({ _id: documentId, userId });
  if (!doc) {
    const error = new Error('Document not found');
    error.statusCode = 404;
    error.code = 'DOCUMENT_NOT_FOUND';
    throw error;
  }

  // If user authorized deleting the Google Drive file (or if it was an app upload)
  if (deleteDriveOriginal || doc.sourceType === 'app_upload' || doc.sourceType === 'drive_import_copy') {
    await deleteFileFromUserDrive(userId, doc.driveFileId);
  }

  await Document.deleteOne({ _id: doc._id });
  invalidateDashboardCache(userId);

  await logAudit({
    userId,
    action: 'DOCUMENT_PERMANENTLY_DELETED',
    resourceType: 'Document',
    resourceId: doc._id,
    metadata: { name: doc.name, driveFileId: doc.driveFileId, deletedFromDrive: deleteDriveOriginal },
  });

  return true;
};
