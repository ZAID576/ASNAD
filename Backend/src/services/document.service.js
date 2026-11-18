import mongoose from 'mongoose';
import { Document } from '../models/Document.js';
import { AuditLog } from '../models/AuditLog.js';
import { AppError } from '../middleware/errorMiddleware.js';
import { getAuthenticatedDriveClient } from './googleDrive.service.js';
import { logger } from '../lib/logger.js';

export async function listDocuments(userId, query = {}) {
  const {
    search,
    categoryId,
    isFavorite,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 20,
    includeTrash = false,
  } = query;

  const filter = {
    userId: new mongoose.Types.ObjectId(userId),
    deletedAt: includeTrash ? { $ne: null } : null,
  };

  if (categoryId) {
    if (categoryId === 'uncategorized') {
      filter.categoryId = null;
    } else if (mongoose.Types.ObjectId.isValid(categoryId)) {
      filter.categoryId = new mongoose.Types.ObjectId(categoryId);
    }
  }

  if (isFavorite === 'true' || isFavorite === true) {
    filter.isFavorite = true;
  }

  if (search && search.trim()) {
    filter.name = { $regex: search.trim(), $options: 'i' };
  }

  const sortDirection = sortOrder === 'asc' ? 1 : -1;
  const sortOptions = {};
  if (sortBy === 'name') sortOptions.name = sortDirection;
  else if (sortBy === 'size') sortOptions.size = sortDirection;
  else sortOptions.createdAt = sortDirection;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [documents, total] = await Promise.all([
    Document.find(filter)
      .populate('categoryId', 'name color icon')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Document.countDocuments(filter),
  ]);

  return {
    documents: documents.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      mimeType: doc.mimeType,
      size: doc.size,
      driveFileId: doc.driveFileId,
      sourceType: doc.sourceType,
      isFavorite: doc.isFavorite,
      category: doc.categoryId ? {
        id: doc.categoryId._id.toString(),
        name: doc.categoryId.name,
        color: doc.categoryId.color,
        icon: doc.categoryId.icon,
      } : null,
      webViewLink: doc.webViewLink,
      thumbnailLink: doc.thumbnailLink,
      deletedAt: doc.deletedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })),
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum) || 1,
    },
  };
}

export async function getDocumentById(userId, documentId) {
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new AppError('Invalid document ID format', 400, 'INVALID_DOCUMENT_ID');
  }

  const document = await Document.findOne({
    _id: documentId,
    userId,
  }).populate('categoryId', 'name color icon');

  if (!document) {
    throw new AppError('Document not found or access denied', 404, 'DOCUMENT_NOT_FOUND');
  }

  return {
    id: document._id.toString(),
    name: document.name,
    mimeType: document.mimeType,
    size: document.size,
    driveFileId: document.driveFileId,
    sourceType: document.sourceType,
    isFavorite: document.isFavorite,
    category: document.categoryId ? {
      id: document.categoryId._id.toString(),
      name: document.categoryId.name,
      color: document.categoryId.color,
      icon: document.categoryId.icon,
    } : null,
    webViewLink: document.webViewLink,
    thumbnailLink: document.thumbnailLink,
    deletedAt: document.deletedAt,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

export async function updateDocument(userId, documentId, updates) {
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new AppError('Invalid document ID format', 400, 'INVALID_DOCUMENT_ID');
  }

  const allowedUpdates = {};
  if (updates.name && updates.name.trim()) {
    allowedUpdates.name = updates.name.trim();
  }
  if (updates.categoryId !== undefined) {
    allowedUpdates.categoryId = updates.categoryId ? new mongoose.Types.ObjectId(updates.categoryId) : null;
  }
  if (updates.isFavorite !== undefined) {
    allowedUpdates.isFavorite = Boolean(updates.isFavorite);
  }

  const document = await Document.findOneAndUpdate(
    { _id: documentId, userId },
    { $set: allowedUpdates },
    { new: true }
  ).populate('categoryId', 'name color icon');

  if (!document) {
    throw new AppError('Document not found or access denied', 404, 'DOCUMENT_NOT_FOUND');
  }

  await AuditLog.create({
    userId,
    action: 'DOCUMENT_UPDATED',
    resourceType: 'document',
    resourceId: document._id,
    metadata: allowedUpdates,
  });

  return document;
}

export async function softDeleteDocument(userId, documentId) {
  const document = await Document.findOneAndUpdate(
    { _id: documentId, userId, deletedAt: null },
    { $set: { deletedAt: new Date() } },
    { new: true }
  );

  if (!document) {
    throw new AppError('Document not found or already moved to trash', 404, 'DOCUMENT_NOT_FOUND');
  }

  await AuditLog.create({
    userId,
    action: 'DOCUMENT_TRASHED',
    resourceType: 'document',
    resourceId: document._id,
  });

  return document;
}

export async function restoreDocument(userId, documentId) {
  const document = await Document.findOneAndUpdate(
    { _id: documentId, userId, deletedAt: { $ne: null } },
    { $set: { deletedAt: null } },
    { new: true }
  );

  if (!document) {
    throw new AppError('Document not found in trash', 404, 'DOCUMENT_NOT_FOUND');
  }

  await AuditLog.create({
    userId,
    action: 'DOCUMENT_RESTORED',
    resourceType: 'document',
    resourceId: document._id,
  });

  return document;
}

export async function permanentlyDeleteDocument(userId, documentId, deleteDriveFile = false) {
  const document = await Document.findOne({
    _id: documentId,
    userId,
  });

  if (!document) {
    throw new AppError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
  }

  if (deleteDriveFile && document.driveFileId && document.sourceType !== 'drive_import_link') {
    try {
      const { drive } = await getAuthenticatedDriveClient(userId);
      await drive.files.delete({ fileId: document.driveFileId });
    } catch (err) {
      logger.warn(`Could not delete Drive file ${document.driveFileId}:`, err.message);
    }
  }

  await Document.deleteOne({ _id: documentId, userId });

  await AuditLog.create({
    userId,
    action: 'DOCUMENT_PERMANENTLY_DELETED',
    resourceType: 'document',
    resourceId: document._id,
    metadata: { deletedFromDrive: deleteDriveFile },
  });

  return { success: true };
}

export async function toggleFavorite(userId, documentId) {
  const document = await Document.findOne({ _id: documentId, userId });
  if (!document) {
    throw new AppError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
  }

  document.isFavorite = !document.isFavorite;
  await document.save();

  return document;
}

