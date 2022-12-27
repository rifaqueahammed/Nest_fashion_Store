/* eslint-disable no-console */
const Category = require("../../model/category");

module.exports = {
  getCategory: async (req, res) => {
    const categories = await Category.find().lean();
    res.render("admin/category", { admin: true, categories });
  },

  addCategory: async (req, res) => {
    try {
      const categoryData = req.body.category;
      Category.findOne({ category: categoryData }).then((result) => {
        if (result) {
          console.log("category already exit");
        } else {
          const newCategory = new Category({
            category: categoryData,
          });
          newCategory.save().then(() => {
            res.redirect("/admin/category");
          });
        }
      });
    } catch {
      res.render("admin/error500");
    }
  },

  blockingCategory: (req, res) => {
    try {
      const categoryId = req.params.id;
      Category.updateOne(
        { _id: categoryId },
        { $set: { isBlocked: true } }
      ).then(() => {
        res.redirect("/admin/category");
      });
    } catch {
      res.render("admin/error500");
    }
  },

  editCategory: (req, res) => {
    try {
      const categoryId = req.params.id;
      Category.updateOne(
        { _id: categoryId },
        { $set: { category: req.body.category } }
      ).then(() => {
        res.redirect("/admin/category");
      });
    } catch {
      res.render("admin/error500");
    }
  },
};
