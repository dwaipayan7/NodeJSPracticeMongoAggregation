import * as OrderService from "../services/order.service.js";

export const createOrder = async (req, res, next) => {
  try {
    const result = await OrderService.createOrder(req.body);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
