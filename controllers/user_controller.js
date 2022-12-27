/* eslint-disable no-console */
const bcrypt = require("bcrypt");
const User = require("../model/user");
const Product = require("../model/product");
const Category = require("../model/category");
const mailer = require("../middlewares/otpValidation");
const Otp = require("../model/otp");

module.exports = {
  guestHomeView: async (req, res) => {
    try {
      const categories = await Category.find().lean();
      const products = await Product.find().lean().populate("category");
      res.render("user/userhome", { user: true, categories, products });
    } catch{
     res.render('user/error500')
    }
  },

  homeView: async (req, res) => {
    try {
      const categories = await Category.find().lean();
      const products = await Product.find().lean().populate("category");
      const usersession = req.session.user;
      res.render("user/userhome", {
        user: true,
        usersession,
        products,
        categories,
      });
    } catch {
      res.render('user/error500');
    }
  },

  // user Login
  userLogin: (req, res) => {
    if (req.session.user) {
      res.redirect("/");
    } else {
      res.render("user/login", { err_massage: req.session.error });
      req.session.error=false
    }
  },

  doSignin: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (validPassword) {
          if (user.isBlocked) {
            req.session.error = "User is Blocked";
            res.redirect("login");
          } else {
            req.session.user = user;
            res.redirect("/");
          }
        } else {
          req.session.error = "Wrong password";
          res.redirect("login");
        }
      } else {
        req.session.error = "Invalid email";
        res.redirect("login");
      }
    } catch {
      res.render('user/error500');
    }
  },

  // user Signup
  userSignup: (req, res) => {
    res.render("user/signup");
  },

  dosignUp: (req, res) => {
    try {
      const userData = req.body;
      if (req.body.password === req.body.confirm_password) {
        User.findOne({
          $or: [{ email: userData.email }, { mobile_number: userData.mobile_number }],
        }).then(async (result) => {
          if (result) {
            res.render("user/signup", { err_massage: "User Already Exist" });
          } else {
            const mailDetails = {
              from: process.env.nodmailer_email,
              to: userData.email,
              subject: "Nest fashion OTP login",
              html: `<p>Your OTP For Nest fashion login is ${mailer.OTP}</p>`,
            };
            mailer.mailTransporter.sendMail(mailDetails, (err) => {
              if (err) {
                console.log(err);
              } else {
                const newOtp = new Otp({
                  otp: mailer.OTP,
                  email:userData.email
                });
                newOtp.save().then(() => {
                        res.render("user/otpLogin", {userData});
                      });
              }
            });
          }
        });
      } else {
        res.render("user/signup", { err_massage: "Password must be same" });
      }
    } catch {
      res.render('user/error500');
    }
  },

  doOTPsignUp: async (req, res) => {
    try{
      const userData = req.body;
      const verifyUser = await Otp.find({$and:[{email:userData.email},{otp:userData.otp}] });
      if (verifyUser) {
        Otp.deleteOne({ email:userData.email });
          // generate salt to hash password
          const salt = await bcrypt.genSalt(10);
          // now we set user password to hashed password
          userData.password = await bcrypt.hash(userData.password, salt);
          const newUser = new User({
            name: userData.name,
            email: userData.email,
            mobile_number: userData.mobile_number,
            password: userData.password,
          });
          newUser.save().then(() => {
            res.redirect("/login");
          });
      } else {
        res.render('user/error500');
      }
    }catch{
      res.render('user/error500');
    }
    
  },

  // user Signout
  dosignOut: (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/");
    } catch {
      res.render('user/error500');
    }
  },
};
