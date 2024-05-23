const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;
    //validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User Not Found");
    }
    // if (inventoryType === "in" && user.role !== "donor") {
    //   throw new Error("Not a donor");
    // }
    // if (inventoryType === "out" && user.role !== "hospital") {
    //   throw new Error("Not a Hospital");
    // }

    if (req.body.inventoryType == "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.quantity;
      const organisation = new mongoose.Types.ObjectId(req.body.userId);
      //calculate Blood Quantity
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      // console.log("Total In", totalInOfRequestedBlood);
      const totalIn = totalInOfRequestedBlood[0]?.total || 0;

      //calculate OUT Blood
      const totalOutOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBlood[0]?.total || 0;

      //in/Out Calculate
      const availableQuantityofBloodGroup = totalIn - totalOut;

      //quantity validation
      if (availableQuantityofBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `${availableQuantityofBloodGroup}ml of ${requestedBloodGroup.toUpperCase()} is available`,
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donor = user?._id;
    }

    //save record
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    return res.status(201).send({
      success: "true",
      message: "New Blood Record Added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Creating Inventory API",
      error,
    });
  }
};

//GET BLOOD RECORDS
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .populate("donor")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "Inventory get Successful",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Get Inventory",
      error,
    });
  }
};

//get donor records

const getDonorsController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    //find donors
    const donorId = await inventoryModel.distinct("donor", {
      organisation,
    });
    // console.log(donorId);
    const donors = await userModel.find({ _id: { $in: donorId } });

    return res.status(200).send({
      success: true,
      message: "Donor Record Fetched Successfully",
      donors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Donor Records",
      error,
    });
  }
};

//get recent blood records(3)
const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .limit(3)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "Recent Data",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in recent inventory API",
      error,
    });
  }
};

//get hospital records
const getHospitalController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    //find hospitals
    const hospitalId = await inventoryModel.distinct("hospital", {
      organisation,
    });
    // console.log(hospitalId);
    const hospitals = await userModel.find({ _id: { $in: hospitalId } });

    return res.status(200).send({
      success: true,
      message: "Hospital Record Fetched Successfully",
      hospitals,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in Getting Hospital Records",
      error,
    });
  }
};

//get organisation records
const getOrganisationController = async (req, res) => {
  try {
    const donor = req.body.userId;
    const orgId = await inventoryModel.distinct("organisation", { donor });
    //find organisation
    const organisations = await userModel.find({
      _id: { $in: orgId },
    });
    return res.status(200).send({
      success: true,
      message: "Organisation Data fetched successfully",
      organisations,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in Getting Organisation Records",
      error,
    });
  }
};

//GET organisation for hospital
const getOrganisationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId;
    const orgId = await inventoryModel.distinct("organisation", { hospital });
    //find organisation
    const organisations = await userModel.find({
      _id: { $in: orgId },
    });
    return res.status(200).send({
      success: true,
      message: "Hospital organisation Data fetched successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Getting Hospital Organisation Records",
      error,
    });
  }
};

//GET HOSPITAL BLOOD RECORDS
const getInventoryHospitalController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donor")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "hospital consumer record get Successful",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Get consumer Inventory",
      error,
    });
  }
};

// const getInventoryDonorController = async (req, res) => {
//   try {
//     const inventory = await inventoryModel
//       .find(req.body.filters)
//       .populate("donor")
//       // .populate("hospital")
//       // .populate("organisation")
//       .sort({ createdAt: -1 });
//     return res.status(200).send({
//       success: true,
//       message: "Donor Donation record get Successful",
//       inventory,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Error in Get Donation Inventory",
//       error,
//     });
//   }
// };

module.exports = {
  createInventoryController,
  getInventoryController,
  getDonorsController,
  getHospitalController,
  getOrganisationController,
  getOrganisationForHospitalController,
  getInventoryHospitalController,
  getRecentInventoryController,
  // getInventoryDonorController,
};
