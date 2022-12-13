/* eslint-disable no-console */
const mongoose = require("mongoose");
const Cart = require("../../model/cart");
const Category = require("../../model/category");

module.exports = {
  addCart: async (req, res) => {
    try {
      const productID = req.params.id;
      const userID = req.params.userid;
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
            ).then((resu) => {
              console.log(resu);
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

  getCart: async (req, res) => {
    try {
      const usersession = req.session.user;
      const categories = await Category.find().lean();
      const userID = mongoose.Types.ObjectId(req.params.userid);
      console.log(userID);
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
            numberOfItems: [{ $count: "totalItems" }],
          },
        },

        {
          $unwind: "$numberOfItems",
        },
      ]).then((result) => {
        console.log(result[0]);
        const cartProducts = result[0];
        res.render("user/cart", {
          user: true,
          categories,
          usersession,
          cartProducts,
        });
      });
    } catch (error) {
      console.log(error);
    }
  },
};
