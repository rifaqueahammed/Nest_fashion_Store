const express = require("express");

const router = express.Router();
const adminController = require("../controllers/admin_controller");
const categoryController = require("../controllers/admin/category");
const productController = require("../controllers/admin/products");


/* GET home page. */
router.get("/", adminController.homeView);
router.get("/users", adminController.usersView);

// admin Login
router.get("/login", adminController.adminLogin);
router.post("/login", adminController.doSignin);

// user blocking/unblocking
router.get("/blocking-user/:id", adminController.userBlocking);
router.get("/unblocking-user/:id", adminController.userUnBlocking);

// category 
router.get("/category",categoryController.getCategory);
router.post("/add-category",categoryController.addCategory);
router.get("/blocking-category/:id",categoryController.blockingCategory);
router.post("/edit-category/:id",categoryController.editCategory);

// product 
router.get("/products",productController.getProducts);
router.get("/add-product",productController.addProductpage);
router.post("/add-product",productController.addProduct);
// router.get("/edit-product/:id",productController.editProductpage);
router.get("/block-product/:id",productController.blockProduct);

// admin Logout
router.get("/logout", adminController.dosignOut);

module.exports = router;
