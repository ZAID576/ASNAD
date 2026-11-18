import multer from 'multer';
import * as documentService from '../services/document.service.js';
import * as driveService from '../services/googleDrive.service.js';
import { AppError } from '../middleware/errorMiddleware.js';

// Setup multer memory storage (files are held in memory buffer and streamed directly to Drive)
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

export async function list(req, res, next) {
  try {
    const result = await documentService.listDocuments(req.user._id, req.query);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function upload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'FILE_MISSING', message: 'No file was provided for upload' },
      });
    }

    const { categoryId } = req.body;
    const document = await driveService.uploadDocumentToDrive(
      req.user._id,
      req.file,
      categoryId
    );

    res.status(201).json({
      success: true,
      data: document,
      message: 'Document uploaded successfully to Google Drive',
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const document = await documentService.getDocumentById(req.user._id, req.params.id);
    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const document = await documentService.updateDocument(
      req.user._id,
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      data: document,
      message: 'Document metadata updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function download(req, res, next) {
  try {
    const doc = await documentService.getDocumentById(req.user._id, req.params.id);
    const { stream, name, mimeType } = await driveService.downloadDocumentFromDrive(
      req.user._id,
      doc.driveFileId
    );

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(name || doc.name)}"`);
    res.setHeader('Content-Type', mimeType || doc.mimeType || 'application/octet-stream');
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
}

export async function trash(req, res, next) {
  try {
    const document = await documentService.softDeleteDocument(req.user._id, req.params.id);
    res.status(200).json({
      success: true,
      data: document,
      message: 'Document moved to trash',
    });
  } catch (error) {
    next(error);
  }
}

export async function restore(req, res, next) {
  try {
    const document = await documentService.restoreDocument(req.user._id, req.params.id);
    res.status(200).json({
      success: true,
      data: document,
      message: 'Document restored from trash',
    });
  } catch (error) {
    next(error);
  }
}

export async function permanentDelete(req, res, next) {
  try {
    const deleteDriveFile = req.query.deleteDriveFile === 'true';
    await documentService.permanentlyDeleteDocument(
      req.user._id,
      req.params.id,
      deleteDriveFile
    );
    res.status(200).json({
      success: true,
      message: 'Document permanently deleted',
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleFavorite(req, res, next) {
  try {
    const document = await documentService.toggleFavorite(req.user._id, req.params.id);
    res.status(200).json({
      success: true,
      data: document,
      message: document.isFavorite ? 'Added to favorites' : 'Removed from favorites',
    });
  } catch (error) {
    next(error);
  }
}

