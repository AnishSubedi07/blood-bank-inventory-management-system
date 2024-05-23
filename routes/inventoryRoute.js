const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createInventoryController,
  getInventoryController,
  getDonorsController,
  getHospitalController,
  getOrganisationController,
  getOrganisationForHospitalController,
  getInventoryHospitalController,
  getRecentInventoryController,
  // getInventoryDonorController,
} = require("../controller/inventoryController");

const router = express.Router();

//routes
//ADD INVENTORY || POST
router.post("/create-inventory", authMiddleware, createInventoryController);

//GET BLOOD RECORDS
router.get("/get-inventory", authMiddleware, getInventoryController);

//GET RECENT BLOOD RECORDS
router.get(
  "/get-recent-inventory",
  authMiddleware,
  getRecentInventoryController
);

//GET HOSPITAL BLOOD RECORDS
router.post(
  "/get-inventory-hospital",
  authMiddleware,
  getInventoryHospitalController
);

// //GET donor BLOOD RECORDS
// router.post(
//   "/get-inventory-donor",
//   authMiddleware,
//   getInventoryDonorController
// );

//GET Donor RECORDS
router.get("/get-donors", authMiddleware, getDonorsController);

//GET HOSPITAL RECORDS
router.get("/get-hospitals", authMiddleware, getHospitalController);

//GET Organisation RECORDS
router.get("/get-organisation", authMiddleware, getOrganisationController);

//GET organisation for hospital RECORDS
router.get(
  "/get-organisation-for-hospital",
  authMiddleware,
  getOrganisationForHospitalController
);

module.exports = router;
