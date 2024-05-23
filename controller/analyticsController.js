const inventoryModel = require("../models/inventoryModel");
const mongoose = require("mongoose");

//Get blood data
const bloodGroupDetailsController = async (req, res) => {
  try {
    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const bloodGroupData = [];
    const organisation = new mongoose.Types.ObjectId(req.body.userId);

    //get single bg
    await Promise.all(
      bloodGroups.map(async (bloodGroup) => {
        //Count Total In
        const totalIn = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "in",
              organisation,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);

        //Count Total Out
        const totalOut = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "out",
              organisation,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);

        //calc total
        const availableBlood =
          (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);

        //Push Data
        bloodGroupData.push({
          bloodGroup,
          totalIn: totalIn[0]?.total || 0,
          totalOut: totalOut[0]?.total || 0,
          availableBlood,
        });
      })
    );

    return res.status(200).send({
      success: true,
      message: "Blood Group Data Fetched Successfully",
      bloodGroupData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Analytics API",
      error,
    });
  }
};

module.exports = { bloodGroupDetailsController };
