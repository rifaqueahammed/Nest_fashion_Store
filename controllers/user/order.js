/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const mongoose = require("mongoose");
const moment = require("moment");
const Category = require("../../model/category");
const User = require("../../model/user");
const Cart = require("../../model/cart");
const Order = require("../../model/order");
const Product = require("../../model/product");

moment().format();

module.exports = {
  checkOut: async (req, res) => {
    const categories = await Category.find().lean();
    const usersession = req.session.user;
    const userID = mongoose.Types.ObjectId(req.session.user._id);
    const address = await User.aggregate([
      {
        $match: { _id: userID },
      },
    ]);

    const cart = await Cart.aggregate([
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
    ]);

    try {
      res.render("user/checkout", {
        user: true,
        categories,
        usersession,
        address: address[0],
        cart: cart[0],
      });
    } catch (error) {
      console.log(error);
    }
  },

  permenantAddress: async (req, res) => {
    try {
      const userID = mongoose.Types.ObjectId(req.session.user._id);
      const address = await User.findOne({ _id: userID });
      if (address.permanentAddress.housename.length) {
        res.json({ status: true, address });
      } else {
        res.json({ addressNotexist: true });
      }
    } catch (error) {
      console.log(error);
    }
  },

  placeOrder: async (req, res, next) => {
    try {
      const addressDetails = req.body;
      const userID = mongoose.Types.ObjectId(req.session.user._id);
      const cartproducts = await Cart.findOne({ userid: userID }).lean();
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
        const status =
          addressDetails.paymentMethod === "Cash On Delivery"
            ? "Placed"
            : "Pending";
        const newOrder = new Order({
          userId: userID,
          name: addressDetails.name,
          deliveryAddress: {
            addressline1: addressDetails.address1,
            addressline2: addressDetails.address2,
            country: addressDetails.country,
            state: addressDetails.state,
            pincode: addressDetails.pincode,
          },
          orderItems: cartproducts.products,
          totalAmount: cartDetails.totalAmount.Amount,
          orderStatus: status,
          paymentMethod: addressDetails.paymentMethod,
          orderDate: moment().format("MMM Do YY"),
          deliveryDate: moment().add(3, "days").format("MMM Do YY"),
        });
        newOrder.save().then(async (order) => {
          if (order.paymentMethod === "Cash On Delivery") {
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
              res.json({ success: true });
            });
          } else {
            req.orderId = order._id;
            next();
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  },

  orderConfirmation: (req, res) => {
    try {
      const usersession = req.session.user;
      res.render("user/orderconfirmation", { usersession });
    } catch (error) {
      console.log(error);
    }
  },

  viewOrders: async (req, res) => {
    try {
      const usersession = req.session.user;
      const userID = mongoose.Types.ObjectId(req.session.user._id);
      const categories = await Category.find().lean();
      const orders = await Order.find({ userId: userID })
        .sort({ createdAt: -1 })
        .lean();
      res.render("user/orderlisting", {
        user: true,
        usersession,
        categories,
        orders,
      });
    } catch (error) {
      console.log(error);
    }
  },

  viewOrderProducts: async (req, res) => {
    try {
      const usersession = req.session.user;
      const orderId = mongoose.Types.ObjectId(req.params.id);
      const categories = await Category.find().lean();
      Order.aggregate([
        {
          $match: { _id: orderId },
        },
        {
          $unwind: "$orderItems",
        },
        {
          $project: {
            totalAmount: "$totalAmount",
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
            totalAmount: 1,
            productQuantity: 1,
            productDetails: { $arrayElemAt: ["$productDetails", 0] },
          },
        },
      ]).then((productData) => {
        res.render("user/orderedproducts", {
          user: true,
          usersession,
          categories,
          productData,
        });
      });
    } catch (error) {
      console.log(error);
    }
  },

  orderCancel: (req, res, next) => {
    try {
      const orderId = mongoose.Types.ObjectId(req.params.id);
      Order.updateOne(
        { _id: orderId },
        {
          $set: { orderStatus: "Cancelled" },
        }
      ).then(() => {
        next();
      });
    } catch (error) {
      console.log(error);
    }
  },

  cancelQuantityUpdation: (req, res) => {
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
        res.redirect("/user/vieworders");
      });
    } catch {
      console.log("error");
    }
  },
};
