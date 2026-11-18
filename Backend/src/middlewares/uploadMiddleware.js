import multer from 'multer';
import { errorResponse } from '../utils/response.js';

// Support any file type stored in Google Drive: images, videos, audio, docs, archives, etc.
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB for direct multipart fallback

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow all file types (Drive handles any format)
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export const handleSingleUpload = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return errorResponse(res, `File exceeds the maximum 100MB size limit`, 'FILE_TOO_LARGE', 400);
      }
      return errorResponse(res, err.message, 'UPLOAD_ERROR', 400);
    } else if (err) {
      return errorResponse(res, err.message, 'INVALID_FILE_TYPE', 400);
    }
    next();
  });
};
