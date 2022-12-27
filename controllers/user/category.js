const Category = require("../../model/category");
const Product = require("../../model/product");

module.exports = {
  getCategoryPage: async (req, res) => {
    try {
      const categoryID = req.params.id;
      const usersession = req.session.user;
      const categories = await Category.find().lean();
      const products = await Product.find({ category: categoryID }).lean();
      res.render("user/userhome", {
        user: true,
        products,
        categories,
        usersession,
      });
    } catch {
      res.render('user/error500')
    }
  },
};
