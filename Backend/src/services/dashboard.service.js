import mongoose from 'mongoose';
import { Document } from '../models/Document.js';
import { Category } from '../models/Category.js';
import { GoogleConnection } from '../models/GoogleConnection.js';

export async function getDashboardSummary(userId) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const [
    totalDocuments,
    totalCategories,
    favoriteCount,
    trashCount,
    storageStats,
    recentDocuments,
    googleConnection,
  ] = await Promise.all([
    Document.countDocuments({ userId: userObjectId, deletedAt: null }),
    Category.countDocuments({ userId: userObjectId }),
    Document.countDocuments({ userId: userObjectId, isFavorite: true, deletedAt: null }),
    Document.countDocuments({ userId: userObjectId, deletedAt: { $ne: null } }),
    Document.aggregate([
      { $match: { userId: userObjectId, deletedAt: null } },
      { $group: { _id: null, totalBytes: { $sum: '$size' } } },
    ]),
    Document.find({ userId: userObjectId, deletedAt: null })
      .populate('categoryId', 'name color icon')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    GoogleConnection.findOne({ userId: userObjectId, status: 'connected' }),
  ]);

  const totalBytes = storageStats.length > 0 ? storageStats[0].totalBytes : 0;

  return {
    metrics: {
      totalDocuments,
      totalCategories,
      favoriteCount,
      trashCount,
      storageUsedBytes: totalBytes,
    },
    recentDocuments: recentDocuments.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      mimeType: doc.mimeType,
      size: doc.size,
      sourceType: doc.sourceType,
      isFavorite: doc.isFavorite,
      category: doc.categoryId ? {
        id: doc.categoryId._id.toString(),
        name: doc.categoryId.name,
        color: doc.categoryId.color,
      } : null,
      createdAt: doc.createdAt,
    })),
    googleDrive: {
      isConnected: !!googleConnection,
      accountEmail: googleConnection ? googleConnection.googleAccountEmail : null,
      folderId: googleConnection ? googleConnection.driveFolderId : null,
    },
  };
}

