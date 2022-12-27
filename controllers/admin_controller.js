/* eslint-disable no-console */
const Admin = require("../model/admin");
const User = require("../model/user");

module.exports = {
  // admin Login
  adminLogin: (req, res) => {
    if (req.session.admin) {
      res.redirect("/admin");
    } else {
      res.render("admin/login");
    }
  },

  doSignin: async (req, res) => {
    try {
      const body = { ...req.body };
      const admin = await Admin.findOne({ email: body.email });
      if (admin) {
        if (body.password === admin.password) {
          req.session.admin = admin;
          res.redirect("/admin");
        } else {
          console.log("password wrong");
        }
      } else {
        console.log("email wrong");
      }
    } catch {
      res.render("admin/error500");
    }
  },

  // admin home
  homeView: (req, res) => {
    res.redirect("/admin/dashboard");
  },

  usersView: async (req, res) => {
    const users = await User.find().lean();
    res.render("admin/users", { users, admin: true });
  },

  // admin user block/unblock
  userBlocking: (req, res) => {
    try {
      const userId = req.params.id;
      User.updateOne({ _id: userId }, { $set: { isBlocked: true } }).then(
        () => {
          res.redirect("/admin/users");
        }
      );
    } catch {
      res.render("admin/error500");
    }
  },

  userUnBlocking: (req, res) => {
    try {
      const userId = req.params.id;
      User.updateOne({ _id: userId }, { $set: { isBlocked: false } }).then(
        () => {
          res.redirect("/admin/users");
        }
      );
    } catch {
      res.render("admin/error500");
    }
  },

  // admin logout
  dosignOut: (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/admin/login");
    } catch {
      res.render("admin/error500");
    }
  },
};
