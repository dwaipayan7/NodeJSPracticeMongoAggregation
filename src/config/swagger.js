const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "NodeJSPractice API",
    version: "1.0.0",
    description:
      "API documentation for user, product, order, and analytics endpoints.",
  },
  servers: [{ url: "http://localhost:3000" }],
  tags: [
    { name: "Users" },
    { name: "Products" },
    { name: "Orders" },
    { name: "Analytics" },
  ],
  components: {
    schemas: {
      UserInput: {
        type: "object",
        required: ["name", "email", "city"],
        properties: {
          name: { type: "string", example: "Dwaipayan Biswas" },
          email: { type: "string", format: "email", example: "test@example.com" },
          city: { type: "string", example: "Kolkata" },
          age: { type: "integer", minimum: 0, example: 25 },
        },
      },
      User: {
        allOf: [
          { $ref: "#/components/schemas/UserInput" },
          {
            type: "object",
            properties: {
              _id: { type: "string", example: "64b7e6f1b2c3d4e5f6789012" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        ],
      },
      ProductInput: {
        type: "object",
        required: ["name", "category", "price"],
        properties: {
          name: { type: "string", example: "Wireless Mouse" },
          category: {
            type: "string",
            enum: ["Electronics", "Clothing", "Books", "Sports", "Furniture"],
            example: "Electronics",
          },
          price: { type: "number", minimum: 0, example: 799 },
          stock: { type: "integer", minimum: 0, example: 50 },
        },
      },
      Product: {
        allOf: [
          { $ref: "#/components/schemas/ProductInput" },
          {
            type: "object",
            properties: {
              _id: { type: "string", example: "64b7e6f1b2c3d4e5f6789013" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        ],
      },
      OrderItemInput: {
        type: "object",
        required: ["productId", "quantity"],
        properties: {
          productId: { type: "string", example: "64b7e6f1b2c3d4e5f6789013" },
          quantity: { type: "integer", minimum: 1, example: 2 },
        },
      },
      OrderInput: {
        type: "object",
        required: ["userId", "items"],
        properties: {
          userId: { type: "string", example: "64b7e6f1b2c3d4e5f6789012" },
          items: {
            type: "array",
            minItems: 1,
            items: { $ref: "#/components/schemas/OrderItemInput" },
          },
          status: {
            type: "string",
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
          },
          paymentMethod: {
            type: "string",
            enum: ["UPI", "Card", "Cash", "NetBanking"],
          },
        },
      },
      Order: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64b7e6f1b2c3d4e5f6789014" },
          userId: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                productId: { type: "string" },
                quantity: { type: "integer" },
                price: { type: "number" },
              },
            },
          },
          totalAmount: { type: "number" },
          status: { type: "string" },
          paymentMethod: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {
    "/api/users": {
      post: {
        tags: ["Users"],
        summary: "Create a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserInput" },
            },
          },
        },
        responses: {
          201: {
            description: "User created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "User created successfully" },
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          500: { description: "Server error" },
        },
      },
    },
    "/api/products": {
      post: {
        tags: ["Products"],
        summary: "Create a product",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Product created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Product created successfully" },
                    data: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
          500: { description: "Server error" },
        },
      },
    },
    "/api/orders": {
      post: {
        tags: ["Orders"],
        summary: "Create an order",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/OrderInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Order created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Order created successfully" },
                    data: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
          },
          400: { description: "Invalid order payload or insufficient stock" },
          404: { description: "User or product not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/analytics/revenue": {
      get: {
        tags: ["Analytics"],
        summary: "Get total revenue",
        responses: {
          200: {
            description: "Revenue totals",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Revenue fetched successfully",
                    },
                    data: {
                      type: "object",
                      properties: {
                        totalRevenue: { type: "number" },
                        totalOrders: { type: "integer" },
                        averageOrderValue: { type: "number" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/analytics/top-products": {
      get: {
        tags: ["Analytics"],
        summary: "Get the top-selling products",
        responses: {
          200: {
            description: "Top five products by quantity sold",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Top selling products fetched successfully",
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          productId: { type: "string" },
                          productName: { type: "string" },
                          category: { type: "string" },
                          totalQuantitySold: { type: "number" },
                          totalSales: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/analytics/category-revenue": {
      get: {
        tags: ["Analytics"],
        summary: "Get revenue by product category",
        responses: {
          200: {
            description: "Revenue grouped by category",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Category revenue fetched successfully",
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/analytics/top-customers": {
      get: {
        tags: ["Analytics"],
        summary: "Get the top customers",
        responses: {
          200: {
            description: "Top ten customers by total spending",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Top customers fetched successfully",
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          userId: { type: "string" },
                          name: { type: "string" },
                          email: { type: "string", format: "email" },
                          city: { type: "string" },
                          totalSpent: { type: "number" },
                          totalOrders: { type: "integer" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/analytics/monthly-revenue": {
      get: {
        tags: ["Analytics"],
        summary: "Get monthly revenue",
        responses: {
          200: {
            description: "Revenue grouped by year and month",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Monthly revenue fetched successfully",
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          year: { type: "integer" },
                          month: { type: "integer", minimum: 1, maximum: 12 },
                          totalRevenue: { type: "number" },
                          totalOrders: { type: "integer" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default swaggerDocument;
