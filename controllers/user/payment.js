/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const mongoose = require("mongoose");
const Crypto = require("crypto");
const Order = require("../../model/order");
const Cart = require("../../model/cart");
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
    } catch (error) {
      console.log(error);
    }
  },

  veryfyPayment: async (req, res) => {
    try {
      const details = req.body;
      const userID = mongoose.Types.ObjectId(req.session.user._id);
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
          Cart.deleteOne({ userid: userID }).then(() => {
            res.json({ paymentSuccess: true });
          });
        });
      } else {
        res.json({ paymentFailed: true });
      }
    } catch (error) {
      console.log(error);
    }
  },

  paymentFailed: (req, res) => {
    try {
      const usersession = req.session.user;
      res.render("user/paymentfailed", { usersession });
    } catch (error) {
      console.log(error);
    }
  },
};
