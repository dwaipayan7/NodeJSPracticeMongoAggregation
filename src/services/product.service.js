import Product from "../model/product.model.js";

export const createProduct = async (payload) => {
  const product = await Product.create({
    name: payload.name,
    category: payload.category,
    price: payload.price,
    stock: payload.stock,
  });

  return product;
};
