/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const Product = require("../../model/product");
const Category = require("../../model/category");

module.exports = {
  getProducts: async (req, res) => {
    const products = await Product.find().lean().populate("category");
    res.render("admin/products", { admin: true, products });
  },

  addProductpage: async (req, res) => {
    const categories = await Category.find().lean();
    res.render("admin/addproduct", { admin: true, categories });
  },

  addProduct: async (req, res) => {
    try {
      const { image } = req.files;
      const newProduct = new Product({
        product_name: req.body.product,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description,
        stock: req.body.stock,
      });
      const products = await newProduct.save();
      if (products) {
        const imageId = products._id;
        image.mv(`./public/images/${imageId}.jpg`, (err) => {
          if (!err) {
            res.redirect("/admin/products");
          } else {
            console.log(err);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  //  editProductpage:async(req, res) => {
  //   const productId= req.params.id
  //   console.log(productId)
  //   // const product = await Product.findOne({_id:productId}).lean()
  //   const categories = await Category.find().lean();
  //   // console.log(product)
  //   console.log(categories)
  //   // res.render("admin/editproduct", { admin: true,product,categories});
  //   res.render("admin/editproduct", { admin: true,categories});
  //   },

  blockProduct: (req, res) => {
    try {
      const productId = req.params.id;
      Product.updateOne({ _id: productId }, { $set: { isBlocked: true } }).then(
        () => {
          res.redirect("/admin/products");
        }
      );
    } catch {
      console.log("error");
    }
  },
};
