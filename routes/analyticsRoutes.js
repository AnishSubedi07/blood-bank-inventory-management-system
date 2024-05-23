const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  bloodGroupDetailsController,
} = require("../controller/analyticsController");

const router = express.Router();

//routes
//GET BLOOD DATA
router.get("/bloodGroups-data", authMiddleware, bloodGroupDetailsController);

module.exports = router;
