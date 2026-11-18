import mongoose from 'mongoose';
import { Document } from '../models/Document.js';
import { Category } from '../models/Category.js';
import { GoogleConnection } from '../models/GoogleConnection.js';
import { AuditLog } from '../models/AuditLog.js';

// Fast in-memory cache to prevent repeated heavy DB queries on rapid navigation
const summaryCache = new Map();
const CACHE_TTL_MS = 15 * 1000; // 15 seconds TTL

export const invalidateDashboardCache = (userId) => {
  if (userId) {
    summaryCache.delete(userId.toString());
  } else {
    summaryCache.clear();
  }
};

export const getDashboardSummary = async (userId) => {
  const userKey = userId.toString();
  const cached = summaryCache.get(userKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const [
    docStats,
    categoryCount,
    googleConnection,
    recentDocs,
  ] = await Promise.all([
    Document.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          totalActive: {
            $sum: { $cond: [{ $eq: ['$deletedAt', null] }, 1, 0] },
          },
          totalFavorites: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$deletedAt', null] }, { $eq: ['$isFavorite', true] }] },
                1,
                0,
              ],
            },
          },
          totalTrash: {
            $sum: { $cond: [{ $ne: ['$deletedAt', null] }, 1, 0] },
          },
          totalBytes: {
            $sum: { $cond: [{ $eq: ['$deletedAt', null] }, '$size', 0] },
          },
        },
      },
    ]),
    Category.countDocuments({ userId: userObjectId }),
    GoogleConnection.findOne({ userId: userObjectId, status: 'connected' }).lean(),
    Document.find({ userId: userObjectId, deletedAt: null })
      .populate('categoryId', 'name color icon')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
  ]);

  const stats = docStats[0] || {
    totalActive: 0,
    totalFavorites: 0,
    totalTrash: 0,
    totalBytes: 0,
  };

  const summaryData = {
    metrics: {
      totalDocuments: stats.totalActive,
      totalFavorites: stats.totalFavorites,
      totalTrash: stats.totalTrash,
      totalCategories: categoryCount,
      totalBytesUsed: stats.totalBytes,
      formattedStorage: formatBytes(stats.totalBytes),
    },
    googleDrive: {
      connected: !!googleConnection,
      googleEmail: googleConnection?.googleAccountEmail || null,
      googleDisplayName: googleConnection?.googleDisplayName || null,
      googleAvatarUrl: googleConnection?.googleAvatarUrl || null,
      driveFolderId: googleConnection?.driveFolderId || null,
      connectedAt: googleConnection?.connectedAt || null,
    },
    recentDocuments: recentDocs.map((doc) => ({
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
      isFavorite: doc.isFavorite,
      webViewLink: doc.webViewLink,
      createdAt: doc.createdAt,
    })),
  };

  summaryCache.set(userKey, {
    data: summaryData,
    timestamp: Date.now(),
  });

  return summaryData;
};

export const getRecentActivity = async (userId) => {
  const logs = await AuditLog.find({ userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return logs.map((l) => ({
    id: l._id,
    action: l.action,
    resourceType: l.resourceType,
    metadata: l.metadata,
    createdAt: l.createdAt,
  }));
};

function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
