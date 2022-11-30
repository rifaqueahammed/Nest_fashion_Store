/* eslint-disable no-console */
const express = require("express");

const router = express.Router();
const userController = require("../controllers/user_controller");

/* GET users listing. */
router.get("/", userController.homeView);

/* GET signin page. */
router.get("/login", userController.userLogin);
router.post("/login", userController.doSignin);

/* GET signup page. */
router.get("/signup", userController.userSignup);
router.post("/signup", userController.dosignUp);

/* signout page. */
router.get("/logout", userController.dosignOut);
module.exports = router;
