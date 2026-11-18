import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Document name is required'],
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      default: 0,
    },
    driveFileId: {
      type: String,
      required: true,
      index: true,
    },
    driveFolderId: {
      type: String,
      default: null,
    },
    webViewLink: {
      type: String,
      default: '',
    },
    sourceType: {
      type: String,
      enum: ['app_upload', 'drive_import_link', 'drive_import_copy'],
      default: 'app_upload',
    },
    isFavorite: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Performance compound indexes for user queries
documentSchema.index({ userId: 1, deletedAt: 1, createdAt: -1 });
documentSchema.index({ userId: 1, categoryId: 1, deletedAt: 1 });
documentSchema.index({ userId: 1, isFavorite: 1, deletedAt: 1 });

export const Document = mongoose.model('Document', documentSchema);
