/* eslint-disable no-console */
const bcrypt = require("bcrypt");
const User = require("../model/user");
const Product = require("../model/product");
const Category = require("../model/category");
const mailer = require("../middlewares/otpValidation");

let body;

module.exports = {
  guestHomeView: async (req, res) => {
    try {
      const categories = await Category.find().lean();
      const products = await Product.find().lean().populate("category");
      res.render("user/userhome", { user: true, categories, products });
    } catch (error) {
      console.log(error);
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
      console.log("error");
    }
  },

  // user Login
  userLogin: (req, res) => {
    if (req.session.user) {
      res.redirect("/user");
    } else {
      res.render("user/login", { err_massage: req.session.error });
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
            res.redirect("/user");
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
      console.log("error");
    }
  },

  // user Signup
  userSignup: (req, res) => {
    res.render("user/signup");
  },

  dosignUp: (req, res) => {
    try {
      body = new User({ ...req.body });
      if (req.body.password === req.body.confirm_password) {
        User.findOne({
          $or: [{ email: body.email }, { mobile_number: body.mobile_number }],
        }).then(async (result) => {
          if (result) {
            res.render("user/signup", { err_massage: "User Already Exist" });
          } else {
            const mailDetails = {
              from: process.env.nodmailer_email,
              to: body.email,
              subject: "Nest fashion OTP login",
              html: `<p>Your OTP For Nest fashion login is ${mailer.OTP}</p>`,
            };
            mailer.mailTransporter.sendMail(mailDetails, (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Email sent successfully");
                res.redirect("/user/otpValidation");
              }
            });
          }
        });
      } else {
        res.render("user/signup", { err_massage: "Password must be same" });
      }
    } catch {
      console.log("error");
    }
  },

  // user Signout
  userOTPsignUp: (req, res) => {
    res.render("user/otpLogin");
  },

  doOTPsignUp: async (req, res) => {
    const { otp } = req.body;
    if (otp === mailer.OTP) {
      try {
        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        body.password = await bcrypt.hash(body.password, salt);
        body.save().then(() => {
          res.redirect("/user/login");
        });
      } catch {
        console.log("error");
      }
    } else {
      console.log("error");
    }
  },

  // user Signout
  dosignOut: (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/user");
    } catch {
      console.log("error");
    }
  },
};
