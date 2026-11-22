import Order from "../model/order.model.js";

export const getTotalRevenue = async () => {
  const result = await Order.aggregate([
    {
      $match: {
        status: "delivered",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$totalAmount",
        },
        totalOrders: {
          $sum: 1,
        },
        averageOrderValue: {
          $avg: "$totalAmount",
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
        totalOrders: 1,
        averageOrderValue: {
          $round: ["$averageOrderValue", 2],
        },
      },
    },
  ]);

  return (
    result[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
    }
  );
};

export const getTopSellingProducts = async () => {
  return await Order.aggregate([
    {
      $match: {
        status: "delivered",
      },
    },
    {
      $unwind: "$items",
    },
    {
      $group: {
        _id: "$items.productId",
        totalQuantitySold: {
          $sum: "$items.quantity",
        },
        totalSales: {
          $sum: {
            $multiply: ["$items.quantity", "$items.price"],
          },
        },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },

    {
      $project: {
        _id: 0,
        productId: "$_id",
        productName: "$productDetails.name",
        category: "$productDetails.category",
        totalQuantitySold: 1,
        totalSales: 1,
      },
    },

    {
      $sort: {
        totalQuantitySold: -1,
      },
    },
    {
      $limit: 5,
    },
  ]);
};

export const getRevenueByCategory = async () => {
  return await Order.aggregate([
    {
      $match: {
        status: "delivered",
      },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $group: {
        _id: "$productDetails.category",
        totalRevenue: {
          $sum: {
            $multiply: ["$items.quantity", "$items.price"],
          },
        },
        totalQuantitySold: {
          $sum: "$items.quantity",
        },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        totalRevenue: 1,
        totalQuantitySold: 1,
      },
    },
    {
      $sort: {
        totalRevenue: -1,
      },
    },
  ]);
};

export const getTopCustomers = async () => {
  return await Order.aggregate([
    {
      $match: {
        status: "delivered",
      },
    },
    {
      $group: {
        _id: "$userId",
        totalSpent: {
          $sum: "$totalAmount",
        },
        totalOrders: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        name: "$user.name",
        email: "$user.email",
        city: "$user.city",
        totalSpent: 1,
        totalOrders: 1,
      },
    },
    {
      $sort: {
        totalSpent: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);
};

//monthly revenue report

export const getMonthlyRevenue = async () => {
  return await Order.aggregate([
    {
      $match: {
        status: "delivered",
      },
    },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        totalRevenue: {
          $sum: "$totalAmount",
        },
        totalOrders: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        totalRevenue: 1,
        totalOrders: 1,
      },
    },

    {
      $sort: {
        year: 1,
        month: 1,
      },
    },
  ]);
};
