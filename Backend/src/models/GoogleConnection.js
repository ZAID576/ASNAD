import mongoose from 'mongoose';

const googleConnectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    googleAccountEmail: {
      type: String,
      default: '',
    },
    googleDisplayName: {
      type: String,
      default: '',
    },
    googleAvatarUrl: {
      type: String,
      default: '',
    },
    encryptedRefreshToken: {
      type: String,
      required: true,
    },
    driveFolderId: {
      type: String,
      default: null, // Asnad root folder ID in user's Drive
    },
    scopes: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['connected', 'revoked', 'error'],
      default: 'connected',
      index: true,
    },
    connectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const GoogleConnection = mongoose.model('GoogleConnection', googleConnectionSchema);
