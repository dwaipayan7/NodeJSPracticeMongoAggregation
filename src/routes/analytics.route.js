import express from "express";
import {
  getMonthlyRevenue,
  getTopCustomers,
  getTopSellingProducts,
  getTotalRevenue,
  getRevenueByCategory,
} from "../controller/analytics.controller.js";

const router = express.Router();

router.get("/revenue", getTotalRevenue);

router.get("/top-products", getTopSellingProducts);

router.get("/category-revenue", getRevenueByCategory);

router.get("/top-customers", getTopCustomers);

router.get("/monthly-revenue", getMonthlyRevenue);

export default router;
