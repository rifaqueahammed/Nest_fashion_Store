const express = require("express");

const router = express.Router();
const verifyLogin = require("../middlewares/session");
const adminController = require("../controllers/admin_controller");
const categoryController = require("../controllers/admin/category");
const productController = require("../controllers/admin/products");

/* GET home page. */
router.get("/", verifyLogin.verifyLoginAdmin, adminController.homeView);
router.get("/users", verifyLogin.verifyLoginAdmin, adminController.usersView);

// admin Login
router.get("/login", adminController.adminLogin);
router.post("/login", adminController.doSignin);

// user blocking/unblocking
router.get("/blocking-user/:id", adminController.userBlocking);
router.get("/unblocking-user/:id", adminController.userUnBlocking);

// category
router.get(
  "/category",
  verifyLogin.verifyLoginAdmin,
  categoryController.getCategory
);
router.post("/add-category", categoryController.addCategory);
router.get("/blocking-category/:id", categoryController.blockingCategory);
router.post("/edit-category/:id", categoryController.editCategory);

// product
router.get(
  "/products",
  verifyLogin.verifyLoginAdmin,
  productController.getProducts
);
router.get(
  "/add-product",
  verifyLogin.verifyLoginAdmin,
  productController.addProductpage
);
router.post("/add-product", productController.addProduct);
// router.get("/edit-product/:id",productController.editProductpage);
router.get("/block-product/:id", productController.blockProduct);

// admin Logout
router.get("/logout", adminController.dosignOut);

module.exports = router;
