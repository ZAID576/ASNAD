import mongoose from 'mongoose';
import { Category } from '../models/Category.js';
import { Document } from '../models/Document.js';
import { AuditLog } from '../models/AuditLog.js';
import { AppError } from '../middleware/errorMiddleware.js';

export async function listCategoriesWithCount(userId) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const categories = await Category.find({ userId: userObjectId }).sort({ name: 1 }).lean();

  // Aggregate document counts per category
  const counts = await Document.aggregate([
    {
      $match: {
        userId: userObjectId,
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
  let uncategorizedCount = 0;
  for (const item of counts) {
    if (item._id) {
      countMap[item._id.toString()] = item.count;
    } else {
      uncategorizedCount = item.count;
    }
  }

  return {
    categories: categories.map(cat => ({
      id: cat._id.toString(),
      name: cat.name,
      color: cat.color,
      icon: cat.icon,
      documentCount: countMap[cat._id.toString()] || 0,
      createdAt: cat.createdAt,
    })),
    uncategorizedCount,
  };
}

export async function createCategory(userId, { name, color = '#4285F4', icon = 'folder' }) {
  if (!name || !name.trim()) {
    throw new AppError('Category name is required', 400, 'VALIDATION_ERROR');
  }

  const existing = await Category.findOne({
    userId,
    name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
  });

  if (existing) {
    throw new AppError('A category with this name already exists', 409, 'DUPLICATE_CATEGORY');
  }

  const category = await Category.create({
    userId,
    name: name.trim(),
    color: color || '#4285F4',
    icon: icon || 'folder',
  });

  await AuditLog.create({
    userId,
    action: 'CATEGORY_CREATED',
    resourceType: 'category',
    resourceId: category._id,
    metadata: { name: category.name },
  });

  return category;
}

export async function updateCategory(userId, categoryId, { name, color, icon }) {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new AppError('Invalid category ID', 400, 'INVALID_ID');
  }

  const updates = {};
  if (name && name.trim()) {
    const existing = await Category.findOne({
      userId,
      _id: { $ne: categoryId },
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });
    if (existing) {
      throw new AppError('Another category already uses this name', 409, 'DUPLICATE_CATEGORY');
    }
    updates.name = name.trim();
  }
  if (color) updates.color = color;
  if (icon) updates.icon = icon;

  const category = await Category.findOneAndUpdate(
    { _id: categoryId, userId },
    { $set: updates },
    { new: true }
  );

  if (!category) {
    throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
  }

  return category;
}

export async function deleteCategory(userId, categoryId, reassignToId = null) {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new AppError('Invalid category ID', 400, 'INVALID_ID');
  }

  const category = await Category.findOne({ _id: categoryId, userId });
  if (!category) {
    throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
  }

  let targetCategoryId = null;
  if (reassignToId && reassignToId !== 'uncategorized') {
    const targetCat = await Category.findOne({ _id: reassignToId, userId });
    if (targetCat) {
      targetCategoryId = targetCat._id;
    }
  }

  // Reassign or un-categorize all documents linked to this category
  await Document.updateMany(
    { userId, categoryId },
    { $set: { categoryId: targetCategoryId } }
  );

  await Category.deleteOne({ _id: categoryId, userId });

  await AuditLog.create({
    userId,
    action: 'CATEGORY_DELETED',
    resourceType: 'category',
    resourceId: categoryId,
    metadata: { reassignToId: targetCategoryId },
  });

  return { success: true, message: 'Category deleted successfully' };
}

