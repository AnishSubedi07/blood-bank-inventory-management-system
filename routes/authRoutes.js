const express = require("express");
const {
  registerController,
  loginController,
  currentUserController,
  homeController,
} = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//routes
//REGISTER || POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//GET CURRENT USER || GET
router.get("/current-user", authMiddleware, currentUserController);

//GET HOMEPAGE
router.get("/home", homeController);

module.exports = router;
