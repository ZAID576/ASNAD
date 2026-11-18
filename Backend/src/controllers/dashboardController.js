import { getDashboardSummary, getRecentActivity } from '../services/dashboardService.js';
import { successResponse } from '../utils/response.js';

export const getSummary = async (req, res, next) => {
  try {
    const summary = await getDashboardSummary(req.user._id);
    return successResponse(res, summary, 'Dashboard summary retrieved');
  } catch (err) {
    next(err);
  }
};

export const getRecent = async (req, res, next) => {
  try {
    const activity = await getRecentActivity(req.user._id);
    return successResponse(res, { activity }, 'Recent activity retrieved');
  } catch (err) {
    next(err);
  }
};
