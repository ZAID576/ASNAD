import * as categoryService from '../services/category.service.js';

export async function list(req, res, next) {
  try {
    const result = await categoryService.listCategoriesWithCount(req.user._id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const { name, color, icon } = req.body;
    const category = await categoryService.createCategory(req.user._id, { name, color, icon });
    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { name, color, icon } = req.body;
    const category = await categoryService.updateCategory(req.user._id, req.params.id, {
      name,
      color,
      icon,
    });
    res.status(200).json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const { reassignToId } = req.body || {};
    const result = await categoryService.deleteCategory(
      req.user._id,
      req.params.id,
      reassignToId
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

