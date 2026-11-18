import { z } from 'zod';
import {
  uploadDocument,
  completeDirectUpload,
  importFromPicker,
  listDocuments,
  getDocumentById,
  updateDocument,
  toggleFavorite,
  moveToTrash,
  restoreFromTrash,
  permanentDeleteDocument,
} from '../services/documentService.js';
import { getFileDownloadStream, initiateResumableUpload } from '../services/googleDriveService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const importSchema = z.object({
  body: z.object({
    driveFileId: z.string().min(1, 'Google Drive file ID is required'),
    name: z.string().min(1, 'File name is required'),
    mimeType: z.string().min(1, 'MIME type is required'),
    size: z.number().optional().default(0),
    importType: z.enum(['drive_import_link', 'drive_import_copy']).default('drive_import_link'),
    categoryId: z.string().nullable().optional(),
  }),
});

export const updateDocSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    categoryId: z.string().nullable().optional(),
  }),
});

export const initiateUpload = async (req, res, next) => {
  try {
    const { name, mimeType, size } = req.body;
    if (!name) {
      return errorResponse(res, 'File name is required', 'INVALID_INPUT', 400);
    }

    const session = await initiateResumableUpload({
      userId: req.user._id,
      fileName: name,
      mimeType: mimeType || 'application/octet-stream',
      size: Number(size) || 0,
    });

    return successResponse(res, session, 'Direct upload session initiated', 200);
  } catch (err) {
    next(err);
  }
};

export const completeUpload = async (req, res, next) => {
  try {
    const { driveFileId, name, mimeType, size, categoryId } = req.body;
    if (!driveFileId || !name) {
      return errorResponse(res, 'Drive file ID and name are required', 'INVALID_INPUT', 400);
    }

    const document = await completeDirectUpload({
      userId: req.user._id,
      driveFileId,
      name,
      mimeType: mimeType || 'application/octet-stream',
      size: Number(size) || 0,
      categoryId,
    });

    return successResponse(res, { document }, 'Document uploaded successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file was uploaded', 'MISSING_FILE', 400);
    }

    const { categoryId } = req.body;
    const document = await uploadDocument({
      userId: req.user._id,
      file: req.file,
      categoryId,
    });

    return successResponse(res, { document }, 'Document uploaded successfully to your Google Drive', 201);
  } catch (err) {
    next(err);
  }
};

export const importFromDrive = async (req, res, next) => {
  try {
    const { driveFileId, name, mimeType, size, importType, categoryId } = req.body;

    const document = await importFromPicker({
      userId: req.user._id,
      driveFileId,
      name,
      mimeType,
      size,
      importType,
      categoryId,
    });

    return successResponse(res, { document }, 'Document imported successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const list = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      categoryId,
      search,
      isFavorite,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      includeTrash,
    } = req.query;

    const result = await listDocuments(req.user._id, {
      page,
      limit,
      categoryId,
      search,
      isFavorite,
      sortBy,
      sortOrder,
      includeTrash,
    });

    return successResponse(res, result, 'Documents retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const document = await getDocumentById(req.user._id, req.params.id);
    return successResponse(res, { document }, 'Document details retrieved');
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const { name, categoryId } = req.body;
    const document = await updateDocument(req.user._id, req.params.id, { name, categoryId });
    return successResponse(res, { document }, 'Document updated successfully');
  } catch (err) {
    next(err);
  }
};

export const favorite = async (req, res, next) => {
  try {
    const result = await toggleFavorite(req.user._id, req.params.id);
    return successResponse(res, result, result.isFavorite ? 'Added to favorites' : 'Removed from favorites');
  } catch (err) {
    next(err);
  }
};

export const deleteDoc = async (req, res, next) => {
  try {
    await moveToTrash(req.user._id, req.params.id);
    return successResponse(res, null, 'Document moved to trash');
  } catch (err) {
    next(err);
  }
};

export const restoreDoc = async (req, res, next) => {
  try {
    await restoreFromTrash(req.user._id, req.params.id);
    return successResponse(res, null, 'Document restored from trash');
  } catch (err) {
    next(err);
  }
};

export const permanentDeleteDoc = async (req, res, next) => {
  try {
    const deleteDriveOriginal = req.query.deleteDriveOriginal === 'true' || req.query.deleteDriveFile === 'true';
    await permanentDeleteDocument(req.user._id, req.params.id, deleteDriveOriginal);
    return successResponse(res, null, 'Document permanently deleted');
  } catch (err) {
    next(err);
  }
};

export const download = async (req, res, next) => {
  try {
    const doc = await getDocumentById(req.user._id, req.params.id);
    const { stream, name, mimeType } = await getFileDownloadStream(req.user._id, doc.driveFileId);

    const safeName = encodeURIComponent(name || doc.name);
    res.setHeader('Content-Type', mimeType || doc.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"; filename*=UTF-8''${safeName}`);

    stream.on('error', (streamErr) => {
      next(streamErr);
    });

    stream.pipe(res);
  } catch (err) {
    next(err);
  }
};

export const viewFile = async (req, res, next) => {
  try {
    const doc = await getDocumentById(req.user._id, req.params.id);
    const { stream, name, mimeType } = await getFileDownloadStream(req.user._id, doc.driveFileId);

    const safeName = encodeURIComponent(name || doc.name);
    const finalMime = mimeType || doc.mimeType || 'application/octet-stream';
    res.setHeader('Content-Type', finalMime);
    res.setHeader('Content-Disposition', `inline; filename="${safeName}"; filename*=UTF-8''${safeName}`);
    res.setHeader('Cache-Control', 'private, max-age=3600');

    stream.on('error', (streamErr) => {
      next(streamErr);
    });

    stream.pipe(res);
  } catch (err) {
    next(err);
  }
};
