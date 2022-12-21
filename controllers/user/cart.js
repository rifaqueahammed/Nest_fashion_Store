/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const mongoose = require("mongoose");
const Cart = require("../../model/cart");
const Category = require("../../model/category");

module.exports = {
  addCart: async (req, res) => {
    try {
      const productID = req.params.id;
      const userID = req.session.user._id;
      const userCart = await Cart.findOne({ userid: userID });
      if (userCart) {
        Cart.findOne({
          $and: [
            { userid: userID },
            { products: { $elemMatch: { productid: productID } } },
          ],
        }).then((result) => {
          if (result) {
            Cart.updateOne(
              { "products.productid": productID },
              { $inc: { "products.$.quantity": 1 } }
            ).then(() => {
              res.redirect(`/user/getProduct/${productID}`);
            });
          } else {
            Cart.updateOne(
              { userid: userID },
              {
                $push: { products: { productid: productID, quantity: 1 } },
              }
            ).then(() => {
              res.redirect(`/user/getProduct/${productID}`);
            });
          }
        });
      } else {
        const newUserCart = new Cart({
          userid: userID,
          products: [
            {
              productid: productID,
              quantity: 1,
            },
          ],
        });
        newUserCart.save().then(() => {
          res.redirect(`/user/getProduct/${productID}`);
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  viewCart: async (req, res) => {
    try {
      const usersession = req.session.user;
      const categories = await Category.find().lean();
      const userID = mongoose.Types.ObjectId(req.params.userid);
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
        const cartProducts = result[0];
        res.render("user/cart", {
          user: true,
          categories,
          usersession,
          cartProducts
        });
      });
    } catch (error) {
      console.log(error);
    }
  },

  changeProductQuantity: (req, res, next) => {
    try {
      const data = req.body;
      const { count } = data;
      const productID = data.productId;
      const userID = req.session.user._id;
      // eslint-disable-next-line eqeqeq
      if (data.count == -1 && data.quantity == 1) {
        Cart.updateOne(
          {
            $and: [{ userid: userID }, { "products.productid": productID }],
          },
          {
            $pull: { products: { productid: productID } },
          }
        ).then(async () => {
          req.productRemoved = true;
          next();
        });
      } else {
        Cart.updateOne(
          {
            $and: [{ userid: userID }, { "products.productid": productID }],
          },
          { $inc: { "products.$.quantity": count } }
        ).then(() => {
          req.productQuantityChanged = true;
          next();
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  cartTotalAmounts: async (req, res) => {
    try {
      const { productRemoved } = req;
      const { productQuantityChanged } = req;
      const data = req.body;
      const productID = mongoose.Types.ObjectId(data.productId);
      const userID = mongoose.Types.ObjectId(req.session.user._id);
      const productData = await Cart.aggregate([
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
            totalAmount: [
              {
                $group: {
                  _id: "",
                  Amount: { $sum: "$productPrice" },
                },
              },
            ],
            numberOfItems: [{ $count: "totalItems" }],
            data: [{ $match: { productItem: productID } }],
          },
        },
        {
          $unwind: "$numberOfItems",
        },
        {
          $unwind: "$totalAmount",
        },
        {
          $unwind: "$data",
        },
      ]);
      res.json({ productQuantityChanged, productData, productRemoved });
    } catch (error) {
      console.log(error);
    }
  },

  deleteProduct: (req, res) => {
    try {
      const productID = req.params.id;
      const userID = req.session.user._id;
      Cart.updateOne(
        {
          $and: [{ userid: userID }, { "products.productid": productID }],
        },
        {
          $pull: { products: { productid: productID } },
        }
      ).then(() => {
        res.json({ productRemoved: true });
      });
    } catch (error) {
      console.log(error);
    }
  },
};
