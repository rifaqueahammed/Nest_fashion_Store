/* eslint-disable no-console */
const express = require("express");

const router = express.Router();
const verifyLogin = require("../middlewares/session");
const userController = require("../controllers/user_controller");
const categoryController = require("../controllers/user/category");
const productController = require("../controllers/user/product")
const cartController = require("../controllers/user/cart")
const wishlistController = require("../controllers/user/wishlist")
const orderController = require("../controllers/user/order")
const paymentController = require("../controllers/user/payment")
const profileController = require("../controllers/user/profile")

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
router.post("/otpValidation", userController.doOTPsignUp);

/* Category management */
router.get("/getCategoryPage/:id",verifyLogin.verifyLoginUser,categoryController.getCategoryPage);

/* Product management */
router.get("/getProduct/:id",verifyLogin.verifyLoginUser,productController.getProductDetails);

/* Profile management */
router.get("/profile",verifyLogin.verifyLoginUser,profileController.getProfile);
router.post("/addPermanentAddress",verifyLogin.verifyLoginUser,profileController.addPermanentAddress);
router.get("/profileedit",verifyLogin.verifyLoginUser,profileController.editProfile);

/* Wishlist management */
router.get("/wishlist/:id",verifyLogin.verifyLoginUser,wishlistController.addtoWishlist);
router.get("/viewwishlist",verifyLogin.verifyLoginUser,wishlistController.viewWishlist);
router.get("/movetoCart/:id",verifyLogin.verifyLoginUser,wishlistController.movetoCart,wishlistController.deletewishlistProduct);
router.get("/deletewishlistProduct/:id",verifyLogin.verifyLoginUser,wishlistController.deletewishlistProduct);

/* Cart management */
router.get("/addToCart/:id",verifyLogin.verifyLoginUser,cartController.addCart);
router.get("/getCart/:userid",verifyLogin.verifyLoginUser,cartController.viewCart);
router.post("/changeProductQuantity",verifyLogin.verifyLoginUser,cartController.changeProductQuantity,cartController.cartTotalAmounts);
router.get("/deleteProduct/:id",verifyLogin.verifyLoginUser,cartController.deleteProduct);

/* Order management */
router.get("/checkOut",verifyLogin.verifyLoginUser,orderController.checkOut);
router.get("/permenanAddress",verifyLogin.verifyLoginUser,orderController.permenantAddress);
router.post("/placeorder",verifyLogin.verifyLoginUser,orderController.placeOrder,paymentController.generateRazorpay);
router.get("/ordersuccess",verifyLogin.verifyLoginUser,orderController.orderConfirmation);
router.get("/vieworders",verifyLogin.verifyLoginUser,orderController.viewOrders);
router.get("/viewOrderProducts/:id",verifyLogin.verifyLoginUser,orderController.viewOrderProducts);
router.get("/orderCancel/:id",verifyLogin.verifyLoginUser,orderController.orderCancel,orderController.cancelQuantityUpdation)

/* payment management */
router.post("/verifyPayment",verifyLogin.verifyLoginUser,paymentController.veryfyPayment,paymentController.quantityUpdation);
router.get("/paymentFailed",verifyLogin.verifyLoginUser,paymentController.paymentFailed);



/* signout page. */
router.get("/logout", userController.dosignOut);
module.exports = router;
