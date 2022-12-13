/* eslint-disable no-console */
const Product = require("../../model/product");
const Category = require("../../model/category");

module.exports = {
  getProductDetails: async (req, res) => {
    try {
      const productId = req.params.id;
      const usersession = req.session.user;
      const categories = await Category.find().lean();
      const product = await Product.findOne({ _id: productId })
        .lean()
        .populate("category");
      res.render("user/product", {
        user: true,
        categories,
        product,
        usersession,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
