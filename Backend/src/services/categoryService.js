import mongoose from 'mongoose';
import { Category } from '../models/Category.js';
import { Document } from '../models/Document.js';
import { logAudit } from './auditService.js';

export const getCategoriesWithCounts = async (userId) => {
  const categories = await Category.find({ userId }).sort({ createdAt: 1 }).lean();

  // Aggregate document counts per category for this user (only non-deleted docs)
  const counts = await Document.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        deletedAt: null,
      },
    },
    {
      $group: {
        _id: '$categoryId',
        count: { $sum: 1 },
      },
    },
  ]);

  const countMap = {};
  counts.forEach((item) => {
    countMap[item._id ? item._id.toString() : 'uncategorized'] = item.count;
  });

  return categories.map((cat) => ({
    id: cat._id,
    name: cat.name,
    color: cat.color,
    icon: cat.icon,
    documentCount: countMap[cat._id.toString()] || 0,
    createdAt: cat.createdAt,
  }));
};

export const createCategory = async (userId, { name, color, icon }) => {
  const trimmedName = name.trim();
  const existing = await Category.findOne({ userId, name: trimmedName });

  if (existing) {
    const error = new Error(`Category "${trimmedName}" already exists`);
    error.statusCode = 400;
    error.code = 'CATEGORY_EXISTS';
    throw error;
  }

  const category = await Category.create({
    userId,
    name: trimmedName,
    color: color || '#4285F4',
    icon: icon || 'folder',
  });

  await logAudit({
    userId,
    action: 'CATEGORY_CREATED',
    resourceType: 'Category',
    resourceId: category._id,
    metadata: { name: trimmedName },
  });

  return {
    id: category._id,
    name: category.name,
    color: category.color,
    icon: category.icon,
    documentCount: 0,
    createdAt: category.createdAt,
  };
};

export const updateCategory = async (userId, categoryId, { name, color, icon }) => {
  const category = await Category.findOne({ _id: categoryId, userId });
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    error.code = 'CATEGORY_NOT_FOUND';
    throw error;
  }

  if (name && name.trim() !== category.name) {
    const trimmed = name.trim();
    const existing = await Category.findOne({ userId, name: trimmed, _id: { $ne: categoryId } });
    if (existing) {
      const error = new Error(`A category named "${trimmed}" already exists`);
      error.statusCode = 400;
      error.code = 'CATEGORY_EXISTS';
      throw error;
    }
    category.name = trimmed;
  }

  if (color) category.color = color;
  if (icon) category.icon = icon;

  await category.save();

  await logAudit({
    userId,
    action: 'CATEGORY_UPDATED',
    resourceType: 'Category',
    resourceId: category._id,
    metadata: { name: category.name },
  });

  return {
    id: category._id,
    name: category.name,
    color: category.color,
    icon: category.icon,
    createdAt: category.createdAt,
  };
};

export const deleteCategory = async (userId, categoryId, { reassignToCategoryId = null }) => {
  const category = await Category.findOne({ _id: categoryId, userId });
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    error.code = 'CATEGORY_NOT_FOUND';
    throw error;
  }

  // If reassign target specified, verify it belongs to user
  let targetId = null;
  if (reassignToCategoryId) {
    const target = await Category.findOne({ _id: reassignToCategoryId, userId });
    if (target) {
      targetId = target._id;
    }
  }

  // Safe migration of documents — never delete documents when category is deleted!
  await Document.updateMany(
    { userId, categoryId: category._id },
    { $set: { categoryId: targetId } }
  );

  await Category.deleteOne({ _id: category._id });

  await logAudit({
    userId,
    action: 'CATEGORY_DELETED',
    resourceType: 'Category',
    resourceId: category._id,
    metadata: { name: category.name, reassignedTo: targetId },
  });

  return true;
};
