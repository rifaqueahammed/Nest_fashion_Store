const express = require("express");

const router = express.Router();
const adminController = require("../controllers/admin_controller");

/* GET home page. */
router.get("/", adminController.homeView);
router.get("/users", adminController.usersView);

// admin Login

router.get("/login", adminController.adminLogin);
router.post("/login", adminController.doSignin);

// admin Logout
router.get("/logout", adminController.dosignOut);

module.exports = router;
