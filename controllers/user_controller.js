/* eslint-disable no-console */
const bcrypt = require("bcrypt");
const User = require("../model/user");

module.exports = {
  
  homeView: (req, res) => {
    if (req.session.loggedIn) {
      const usersession = req.session.user;
      res.render("user/userhome", { user: true, usersession });
    } else {
      res.render("user/userhome", { user: true });
    }
  },

// user Login
  userLogin: (req, res) => {
    if (req.session.loggedIn) {
      res.redirect("/user");
    } else {
      res.render("user/login", { err_massage: req.session.error });
    }
  },

  doSignin: async (req, res) => {
    try {
      const body = { ...req.body };
      const user = await User.findOne({ email: body.email });
      if (user) {
        const validPassword = await bcrypt.compare(
          body.password,
          user.password
        );
        if (validPassword) {
          req.session.loggedIn = true;
          req.session.user = user;
          res.redirect("/user");
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
      const body = new User({ ...req.body });
      if (req.body.password === req.body.confirm_password) {
        User.find({
          $or: [
            { email: req.body.email },
            { mobile_number: req.body.mobile_number },
          ],
        }).then(async (result) => {
          if (result) {
            res.render("user/signup", { err_massage: "User Already Exist" });
          } else {
            // generate salt to hash password
            const salt = await bcrypt.genSalt(10);
            // now we set user password to hashed password
            body.password = await bcrypt.hash(body.password, salt);
            body.save().then(() => {
              res.redirect("/user/login");
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

// user Signup

  dosignOut: (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/user");
    } catch {
      console.log("error");
    }
  },
};
