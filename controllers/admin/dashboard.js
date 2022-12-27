/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-console */
const moment = require("moment");
const Order = require("../../model/order");
const Product = require("../../model/product");
const User = require("../../model/user");

moment().format();
module.exports = {
  dashboard: async (req, res) => {
    try {
      const orderData = await Order.find({
        orderStatus: { $ne: "Cancelled" },
      });

      const totalAmount = orderData.reduce(
        (accumulator, object) => (accumulator += object.totalAmount),
        0
      );

      const OrderToday = await Order.find({
        orderStatus: { $ne: "Cancelled" },
        orderDate: moment().format("MMM Do YY"),
      });

      const totalOrderToday = OrderToday.reduce(
        (accumulator, object) => (accumulator += object.totalAmount),
        0
      );
      const allOrders = orderData.length;
      const pendingOrder = await Order.find({ orderStatus: "Pending" });
      const pending = pendingOrder.length;
      const processingOrder = await Order.find({ orderStatus: "Shipped" });
      const processing = processingOrder.length;
      const deliveredOrder = await Order.find({ orderStatus: "Delivered" });
      const delivered = deliveredOrder.length;
      const cancelledOrder = await Order.find({ orderStatus: "Cancelled" });
      const cancelled = cancelledOrder.length;
      const cod = await Order.find({ paymentMethod: "Cash On Delivery" });
      const codOrder = cod.length;
      const razorPay = await Order.find({
        paymentMethod: "Online Payment",
      });
      const razorPayOrder = razorPay.length;
      const activeUsers = await User.find({ isBlocked: false }).count();
      const product = await Product.find({ isBlocked: false }).count();
      const allOrderDetails = await Order.find({
        paymentStatus: "Paid",
        orderStatus: "Delivered",
      });
      const start = moment().startOf("month");
      const end = moment().endOf("month");
      const amountPendingList = await Order.find({
        orderStatus: { $ne: "Cancelled" },
        createdAt: {
          $gte: start,
          $lte: end,
        },
      });

      const amountPending = amountPendingList.reduce(
        (accumulator, object) => (accumulator += object.totalAmount),
        0
      );
      res.render("admin/dashboard", {
        admin: true,
        totalAmount: Math.ceil(totalAmount),
        totalOrderToday: Math.ceil(totalOrderToday),
        allOrders,
        pending,
        processing,
        delivered,
        cancelled,
        codOrder,
        razorPayOrder,
        activeUsers,
        product,
        allOrderDetails,
        amountPending: Math.ceil(amountPending),
      });
    } catch {
      res.render("admin/error500");
    }
  },
};
