import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./src/config/db.js";

import userRoutes from "./src/routes/user.route.js";
import productRoutes from "./src/routes/product.routes.js";
import orderRoutes from "./src/routes/order.route.js";
import analyticsRoutes from "./src/routes/analytics.route.js";

import swaggerDocument from "./src/config/swagger.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("Hi, This is dwaipayan");
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal Server Error" : error.message,
  });
});

const startServer = async () => {
  await connectDB();
  app.listen(3000, () => {
    console.log("Server Running on PORT: 3000");
  });
};

startServer();
