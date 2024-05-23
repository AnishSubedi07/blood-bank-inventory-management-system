const express = require("express");
const {
  getDonorsListController,
  getOrganisationsListController,
  getHospitalsListController,
  deleteDonorController,
  deleteHospitalController,
  deleteOrganisationController,
} = require("../controller/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

//GET DONOR LIST
router.get(
  "/donor-list",
  authMiddleware,
  adminMiddleware,
  getDonorsListController
);

//GET HOSPITAL LIST
router.get(
  "/hospital-list",
  authMiddleware,
  adminMiddleware,
  getHospitalsListController
);

//GET ORGANISATION LIST
router.get(
  "/org-list",
  authMiddleware,
  adminMiddleware,
  getOrganisationsListController
);

//DELETE DONAR || GET
router.delete(
  "/delete-donor/:id",
  authMiddleware,
  adminMiddleware,
  deleteDonorController
);

//DELETE HOSPITAL || GET
router.delete(
  "/delete-hospital/:id",
  authMiddleware,
  adminMiddleware,
  deleteHospitalController
);

//DELETE ORGANISATION || GET
router.delete(
  "/delete-org/:id",
  authMiddleware,
  adminMiddleware,
  deleteOrganisationController
);

module.exports = router;
