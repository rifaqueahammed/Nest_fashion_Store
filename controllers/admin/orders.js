/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const mongoose = require("mongoose");
const Order = require("../../model/order");
const Product = require("../../model/product");

module.exports = {
  orders: async (req, res) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 }).lean();
      res.render("admin/orders", { admin: true, orders });
    } catch {
      res.render("admin/error500");
    }
  },

  editStatus: (req, res, next) => {
    try {
      const orderId = req.params.id;
      Order.updateOne(
        { _id: orderId },
        {
          $set: {
            orderStatus: req.body.orderStatus,
            paymentStatus: req.body.paymentStatus,
          },
        }
      ).then(() => {
        if (req.body.orderStatus === "Cancelled") {
          next();
        } else {
          res.redirect("/admin/orders");
        }
      });
    } catch {
      res.render("admin/error500");
    }
  },

  ordersQuantityUpdation: (req, res) => {
    try {
      const orderId = mongoose.Types.ObjectId(req.params.id);
      Order.aggregate([
        {
          $match: { _id: orderId },
        },
        {
          $unwind: "$orderItems",
        },
        {
          $project: {
            orderedproduct: "$orderItems.productid",
            productQuantity: "$orderItems.quantity",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "orderedproduct",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $project: {
            orderedproduct: 1,
            productQuantity: 1,
            productDetails: { $arrayElemAt: ["$productDetails", 0] },
          },
        },
      ]).then((result) => {
        for (let i = 0; i < result.length; i += 1) {
          const updatedStock =
            result[i].productDetails.stock + result[i].productQuantity;
          Product.updateOne(
            {
              _id: result[i].productDetails._id,
            },
            {
              stock: updatedStock,
            }
          ).then(() => {});
        }
        res.redirect("/admin/orders");
      });
    } catch {
      res.render("admin/error500");
    }
  },
};
