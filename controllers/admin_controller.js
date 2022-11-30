/* eslint-disable no-console */
const Admin = require("../model/admin");
const User = require("../model/user");

module.exports = {

// admin Login
 adminLogin: (req, res) => {
    if (req.session.loggedIn) {
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
          console.log("valid admin");
          req.session.loggedIn = true;
          res.redirect("/admin");
        } else {
          console.log("password wrong");
        }
      } else {
        console.log("email wrong");
      }
    } catch {
      console.log("error");
    }
  },

// admin home
  homeView: (req, res) => {
    if (req.session.loggedIn) {
      res.render("admin/adminhome", { admin: true });
    } else {
      res.redirect("admin/login");
    }
  },

  usersView: async (req, res) => {
    const users = await User.find().lean();
    if (req.session.loggedIn) {
      res.render("admin/users", { users, admin: true });
    } else {
      res.redirect("/admin/login");
    }
  },

// admin user block/unblock
  userBlocking:(req,res) =>{
    try{
      const userId = req.params.id;
      User.updateOne({_id:userId},{$set:{isBlocked:true}}).then(() =>{
        res.redirect('/admin/users')
      })
    }catch{
      console.log("error");
    }
   },

   userUnBlocking:(req,res) =>{
    try{
      const userId = req.params.id;
      User.updateOne({_id:userId},{$set:{isBlocked:false}}).then(() =>{
        res.redirect('/admin/users')
      })
    }catch{
      console.log("error");
    }
   },

// admin logout
  dosignOut: (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/admin/login");
    } catch {
      console.log("error");
    }
  },
};
