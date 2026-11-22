import * as ProductService from "../services/product.service.js";

export const createProduct = async (req, res, next) => {
  try {
    const result = await ProductService.createProduct(req.body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
