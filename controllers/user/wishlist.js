/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const mongoose = require("mongoose");
const Wishlist = require("../../model/wishlist");
const Cart = require("../../model/cart");
const Category = require("../../model/category");
const Product = require("../../model/product");

module.exports = {
  addtoWishlist: async (req, res) => {
    try {
      const productID = req.params.id;
      const userID = mongoose.Types.ObjectId(req.session.user._id);
      const userWishlist = await Wishlist.findOne({ userid: userID });
      const product = await Product.findOne({ _id: productID }).lean();
      if (userWishlist) {
        Wishlist.findOne({
          $and: [
            { userid: userID },
            { products: { $elemMatch: { productid: productID } } },
          ],
        }).then((result) => {
          if (result) {
            res.json({ alreadyWishlisted: true });
          } else {
            Wishlist.updateOne(
              { userid: userID },
              {
                $push: {
                  products: {
                    productid: productID,
                    product_name: product.product_name,
                    price: product.price,
                    description: product.description,
                  },
                },
              }
            ).then(() => {
              res.json({ status: "wishlisted" });
            });
          }
        });
      } else {
        const newProduct = new Wishlist({
          userid: userID,
          products: [
            {
              productid: productID,
              product_name: product.product_name,
              price: product.price,
              description: product.description,
            },
          ],
        });
        newProduct.save().then(() => {
          res.json({ status: "wishlisted" });
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  viewWishlist: async (req, res) => {
    try {
      const usersession = req.session.user;
      const userID = mongoose.Types.ObjectId(req.session.user._id);
      const categories = await Category.find().lean();
      const wishlist = await Wishlist.findOne({ userid: userID }).lean();
      const wishlistCount = wishlist.products.length;
      if (wishlistCount >= 1) {
        res.render("user/wishlist", {
          user: true,
          usersession,
          categories,
          wishlist,
        });
      } else {
        res.render("user/emptywishlist", {
          user: true,
          usersession,
          categories,
          wishlist,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  movetoCart: async (req, res, next) => {
    try {
      console.log(req.params.id);
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
              next();
            });
          } else {
            Cart.updateOne(
              { userid: userID },
              {
                $push: { products: { productid: productID, quantity: 1 } },
              }
            ).then(() => {
              next();
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
          next();
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  deletewishlistProduct: (req, res) => {
    try {
      const productID = req.params.id;
      const userID = mongoose.Types.ObjectId(req.session.user._id);
      Wishlist.updateOne(
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
