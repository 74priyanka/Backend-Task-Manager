const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

//PROFILE APIs
//create profile api
// router.post("/createProfile", async (req, res) => {
//   try {
//     const data = req.body; //assuming the request body contains the profile data

//     //create a new profile document using the mongoose model
//     const newProfile = new Profile(data);

//     //save the new profile to the database
//     const response = await newProfile.save();
//     console.log("profile data is saved");

//     //payload
//     const payload = {
//       id: response.id,
//       userName: response.userName,
//     };

//     console.log(JSON.stringify(payload));
//     //generate a token using the payload
//     const token = generateToken(payload);
//     console.log("token is:", token);

//     res.status(200).json({ response: response, token: token });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "internal server error" });
//   }
// });

//get profile  need to remove this
router.get("/getProfile", async (req, res) => {
  try {
    //get the profile from database
    const email = req.query.email;
    const data = await Profile.findOne({ email: email });
    console.log(email);

    console.log("profile data is fetched");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

router.get("/helloWorld", async (req, res) => {
  res.send("Hello world");
});

//update profile
router.put("/updateProfile/:id", async (req, res) => {
  try {
    const profileId = req.params.id; //extract the id from URL parameter
    const updateProfileData = req.body; //update data for the profile of a person

    const response = await Profile.findByIdAndUpdate(
      profileId,
      updateProfileData,
      {
        new: true, //return updated document
        runValidators: true, //run mongoose validation
      }
    );
    if (!response) {
      return res.status(404).json({ error: "profile not found" });
    }
    console.log("profile data is updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

//delete profile
router.delete("/deleteProfile/:id", async (req, res) => {
  try {
    const profileId = req.params.id; //extract the id from URL parameter

    //assuming you have a profile model
    const response = await Profile.findByIdAndDelete(profileId);
    if (!response) {
      return res.status(404).json({ error: "profile not found" });
    }
    console.log("profile data is deleted");
    res.status(200).json({
      message: "profile deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
