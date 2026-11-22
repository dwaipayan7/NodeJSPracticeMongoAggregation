import mongoose from "mongoose";
import User from "../model/user.model.js";
import Product from "../model/product.model.js";
import Order from "../model/order.model.js";

const createHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const createOrder = async (payload) => {
  const { userId, items, status, paymentMethod } = payload;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw createHttpError("Invalid user ID", 400);
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw createHttpError("Order must contain at least one product", 400);
  }

  const user = await User.findById(userId);

  if (!user) {
    throw createHttpError("User not found", 404);
  }

  const quantitiesByProduct = new Map();
  for (const item of items) {
    if (!mongoose.Types.ObjectId.isValid(item.productId)) {
      throw createHttpError("Invalid product ID", 400);
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw createHttpError("Quantity must be a positive integer", 400);
    }

    const productId = item.productId.toString();
    quantitiesByProduct.set(
      productId,
      (quantitiesByProduct.get(productId) || 0) + item.quantity,
    );
  }

  //validate products and calculate total
  const orderItems = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw createHttpError("Product not found", 404);
      }

      const requestedQuantity = quantitiesByProduct.get(item.productId.toString());
      if (product.stock < requestedQuantity) {
        throw createHttpError(`Insufficient stock for ${product.name}`, 400);
      }

      return {
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      };
    }),
  );

  const totalAmount = orderItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0,
  );

  const order = await Order.create({
    userId,
    items: orderItems,
    totalAmount,
    status,
    paymentMethod,
  });

  const stockUpdates = new Map();
  for (const item of orderItems) {
    const productId = item.productId.toString();
    stockUpdates.set(productId, (stockUpdates.get(productId) || 0) + item.quantity);
  }

  await Product.bulkWrite(
    Array.from(stockUpdates.entries()).map(([productId, quantity]) => ({
      updateOne: {
        filter: { _id: productId },
        update: { $inc: { stock: -quantity } },
      },
    })),
  );

  return order;
};
