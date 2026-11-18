import { z } from 'zod';
import {
  getCategoriesWithCounts,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService.js';
import { successResponse } from '../utils/response.js';

export const categorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required').max(50),
    color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Valid hex color required').optional(),
    icon: z.string().max(30).optional(),
  }),
});

export const deleteCategorySchema = z.object({
  body: z.object({
    reassignToCategoryId: z.string().nullable().optional(),
  }),
});

export const list = async (req, res, next) => {
  try {
    const categories = await getCategoriesWithCounts(req.user._id);
    return successResponse(res, { categories }, 'Categories retrieved');
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, color, icon } = req.body;
    const category = await createCategory(req.user._id, { name, color, icon });
    return successResponse(res, { category }, 'Category created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const { name, color, icon } = req.body;
    const category = await updateCategory(req.user._id, req.params.id, { name, color, icon });
    return successResponse(res, { category }, 'Category updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteCat = async (req, res, next) => {
  try {
    const { reassignToCategoryId } = req.body;
    await deleteCategory(req.user._id, req.params.id, { reassignToCategoryId });
    return successResponse(res, null, 'Category deleted and documents safely reassigned');
  } catch (err) {
    next(err);
  }
};
