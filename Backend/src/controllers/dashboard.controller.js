import * as dashboardService from '../services/dashboard.service.js';

export async function getSummary(req, res, next) {
  try {
    const summary = await dashboardService.getDashboardSummary(req.user._id);
    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
}

