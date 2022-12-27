/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const mongoose = require("mongoose");
const Crypto = require("crypto");
const Order = require("../../model/order");
const Cart = require("../../model/cart");
const Product = require("../../model/product");
const instance = require("../../middlewares/razorpay");

module.exports = {
  generateRazorpay: async (req, res) => {
    try {
      const { orderId } = req;
      const orderDetails = await Order.findOne({ _id: orderId }).lean();
      const options = {
        amount: orderDetails.totalAmount * 100, // amount in the smallest currency unit
        currency: "INR",
        receipt: `${orderId}`,
      };
      instance.orders.create(options, (err, order) => {
        if (err) {
          console.log(err);
        } else {
          res.json(order);
        }
      });
    } catch {
      res.render("user/error500");
    }
  },

  veryfyPayment: async (req, res, next) => {
    try {
      const details = req.body;
      let hmac = Crypto.createHmac("sha256", process.env.key_secret);
      hmac.update(
        `${details.payment.razorpay_order_id}|${details.payment.razorpay_payment_id}`
      );
      hmac = hmac.digest("hex");

      if (hmac === details.payment.razorpay_signature) {
        Order.updateOne(
          { _id: details.order.receipt },
          {
            $set: { orderStatus: "Placed", paymentStatus: "Paid" },
          }
        ).then(() => {
          next();
        });
      } else {
        res.json({ paymentFailed: true });
      }
    } catch {
      res.render("user/error500");
    }
  },

  quantityUpdation: (req, res) => {
    try {
      const userID = mongoose.Types.ObjectId(req.session.user._id);
      Cart.aggregate([
        { $match: { userid: userID } },
        { $unwind: "$products" },
        {
          $project: {
            productItem: "$products.productid",
            productQuantity: "$products.quantity",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productItem",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $project: {
            productItem: 1,
            productQuantity: 1,
            productDetails: { $arrayElemAt: ["$productDetails", 0] },
          },
        },
        {
          $addFields: {
            productPrice: {
              $sum: {
                $multiply: ["$productQuantity", "$productDetails.price"],
              },
            },
          },
        },
        {
          $facet: {
            data: [{ $match: {} }],
            totalAmount: [
              {
                $group: {
                  _id: "",
                  Amount: { $sum: "$productPrice" },
                },
              },
            ],
            numberOfItems: [{ $count: "totalItems" }],
          },
        },
        {
          $unwind: "$numberOfItems",
        },
        {
          $unwind: "$totalAmount",
        },
      ]).then((result) => {
        const cartDetails = result[0];
        Cart.deleteOne({ userid: userID }).then(() => {
          for (let i = 0; i < cartDetails.data.length; i += 1) {
            const updatedStock =
              cartDetails.data[i].productDetails.stock -
              cartDetails.data[i].productQuantity;
            Product.updateOne(
              {
                _id: cartDetails.data[i].productDetails._id,
              },
              {
                stock: updatedStock,
              }
            ).then(() => {});
          }
          res.json({ paymentSuccess: true });
        });
      });
    } catch {
      res.render("user/error500");
    }
  },

  paymentFailed: (req, res) => {
    try {
      const usersession = req.session.user;
      res.render("user/paymentfailed", { usersession });
    } catch {
      res.render("user/error500");
    }
  },
};
