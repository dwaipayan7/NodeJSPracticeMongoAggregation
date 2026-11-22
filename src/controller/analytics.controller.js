import * as AnalyticsService from "../services/analytics.service.js";

export const getTotalRevenue = async (req, res, next) => {
  try {
    const result = await AnalyticsService.getTotalRevenue();

    return res.status(200).json({
      success: true,
      message: "Revenue fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopSellingProducts = async (req, res, next) => {
  try {
    const result = await AnalyticsService.getTopSellingProducts();

    return res.status(200).json({
      success: true,
      message: "Top selling products fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenueByCategory = async (req, res, next) => {
  try {
    const result = await AnalyticsService.getRevenueByCategory();

    return res.status(200).json({
      success: true,
      message: "Category revenue fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopCustomers = async (req, res, next) => {
  try {
    const result = await AnalyticsService.getTopCustomers();

    return res.status(200).json({
      success: true,
      message: "Top customers fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyRevenue = async (req, res, next) => {
  try {
    const result = await AnalyticsService.getMonthlyRevenue();

    return res.status(200).json({
      success: true,
      message: "Monthly revenue fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
