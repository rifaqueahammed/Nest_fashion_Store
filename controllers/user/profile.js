/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const mongoose = require("mongoose");
const Category = require("../../model/category");
const User = require("../../model/user");

module.exports = {
  getProfile: async (req, res) => {
    const usersession = req.session.user;
    const categories = await Category.find().lean();
    const useraddress = await User.find({ _id: usersession._id }).lean();
    const address = useraddress[0];
    console.log(address);
    try {
      res.render("user/account", {
        user: true,
        categories,
        usersession,
        address,
      });
    } catch (error) {
      console.log(error);
    }
  },

  addPermanentAddress: (req, res) => {
    try {
      const address = req.body;
      console.log(address);
      const userID = mongoose.Types.ObjectId(req.session.user._id);
      User.updateOne(
        { _id: userID },
        {
          $set: { permanentAddress: address },
        },
        { upsert: true }
      ).then((result) => {
        console.log(result);
        res.redirect("/user/profile");
      });
    } catch (error) {
      console.log(error);
    }
  },

  editProfile: async (req, res) => {
    const categories = await Category.find().lean();
    const usersession = req.session.user;
    try {
      res.render("user/accountedit", { user: true, categories, usersession });
    } catch (error) {
      console.log(error);
    }
  },
};
