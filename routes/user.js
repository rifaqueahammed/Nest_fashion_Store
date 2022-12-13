/* eslint-disable no-console */
const express = require("express");

const router = express.Router();
const verifyLogin = require("../middlewares/session");
const userController = require("../controllers/user_controller");
const categoryController = require("../controllers/user/category");
const productController = require("../controllers/user/product")
const cartController = require("../controllers/user/cart")

/* GET users listing. */
router.get("/", verifyLogin.verifyLoginUser, userController.homeView);
router.get("/guesthome",userController.guestHomeView);
/* GET signin page. */
router.get("/login", userController.userLogin);
router.post("/login", userController.doSignin);

/* GET signup page. */
router.get("/signup", userController.userSignup);
router.post("/signup", userController.dosignUp);

/* GET signup OTP validation. */
router.get("/otpValidation", userController.userOTPsignUp);
router.post("/otpValidation", userController.doOTPsignUp);

/* Category management */
router.get("/getCategoryPage/:id",verifyLogin.verifyLoginUser,categoryController.getCategoryPage);

/* Product management */
router.get("/getProduct/:id",verifyLogin.verifyLoginUser,productController.getProductDetails);

/* Cart management */
router.get("/addToCart/:id/:userid",verifyLogin.verifyLoginUser,cartController.addCart);
router.get("/getCart/:userid",verifyLogin.verifyLoginUser,cartController.getCart);

/* signout page. */
router.get("/logout", userController.dosignOut);
module.exports = router;
