import { listTrash, restoreFromTrash, permanentDeleteDocument } from '../services/documentService.js';
import { successResponse } from '../utils/response.js';

export const list = async (req, res, next) => {
  try {
    const trashItems = await listTrash(req.user._id);
    return successResponse(res, { trash: trashItems }, 'Trash items retrieved');
  } catch (err) {
    next(err);
  }
};

export const restore = async (req, res, next) => {
  try {
    await restoreFromTrash(req.user._id, req.params.id);
    return successResponse(res, null, 'Document restored from trash');
  } catch (err) {
    next(err);
  }
};

export const permanentDelete = async (req, res, next) => {
  try {
    const deleteDriveOriginal = req.query.deleteDriveOriginal === 'true';
    await permanentDeleteDocument(req.user._id, req.params.id, deleteDriveOriginal);
    return successResponse(res, null, 'Document permanently deleted');
  } catch (err) {
    next(err);
  }
};
