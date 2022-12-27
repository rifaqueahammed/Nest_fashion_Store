const express = require("express");

const router = express.Router();
const verifyLogin = require("../middlewares/session");
const adminController = require("../controllers/admin_controller");
const categoryController = require("../controllers/admin/category");
const productController = require("../controllers/admin/products");
const orderController = require("../controllers/admin/orders");
const dashboardController = require("../controllers/admin/dashboard");


/* GET home page. */
router.get("/", verifyLogin.verifyLoginAdmin, adminController.homeView);
router.get("/users", verifyLogin.verifyLoginAdmin, adminController.usersView);

// admin Login
router.get("/login",adminController.adminLogin);
router.post("/login",adminController.doSignin);

// user blocking/unblocking
router.get("/blocking-user/:id",verifyLogin.verifyLoginAdmin,adminController.userBlocking);
router.get("/unblocking-user/:id",verifyLogin.verifyLoginAdmin,adminController.userUnBlocking);

// category
router.get("/category",verifyLogin.verifyLoginAdmin,categoryController.getCategory);
router.post("/add-category",verifyLogin.verifyLoginAdmin,categoryController.addCategory);
router.get("/blocking-category/:id",verifyLogin.verifyLoginAdmin,categoryController.blockingCategory);
router.post("/edit-category/:id",verifyLogin.verifyLoginAdmin,categoryController.editCategory);

// product
router.get("/products",verifyLogin.verifyLoginAdmin,productController.getProducts);
router.get("/add-product",verifyLogin.verifyLoginAdmin,productController.addProductpage);
router.post("/add-product",verifyLogin.verifyLoginAdmin,productController.addProduct);
router.get("/edit-product/:id",verifyLogin.verifyLoginAdmin,productController.editProductpage);
router.post("/edit-product/:id",verifyLogin.verifyLoginAdmin,productController.editProduct);
router.get("/block-product/:id",verifyLogin.verifyLoginAdmin,productController.blockProduct);

// orders
router.get("/orders",verifyLogin.verifyLoginAdmin,orderController.orders);
router.post("/editOrderStatus/:id",verifyLogin.verifyLoginAdmin,orderController.editStatus,orderController.ordersQuantityUpdation);

// dashboard
router.get("/dashboard",verifyLogin.verifyLoginAdmin,dashboardController.dashboard);

// admin Logout
router.get("/logout", adminController.dosignOut);

module.exports = router;
