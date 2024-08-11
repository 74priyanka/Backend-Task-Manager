const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

//Authentication APIs
//signup api
router.post("/signup", async (req, res) => {
  try {
    const { name, userName, email, password, contact } = req.body;

    // Validate the input
    if (!name || !userName || !password || !email || !contact) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // Check if the username or email already exists
    const existingProfile = await Profile.findOne({
      $or: [{ userName }, { email }],
    });
    if (existingProfile) {
      return res.status(400).json({ error: "Username or email already taken" });
    }

    // Create a new profile document
    const newProfile = new Profile({
      userName,
      email,
      password,
      name,
      contact,
    });

    // Save the new profile to the database
    const response = await newProfile.save();
    console.log("Profile data is saved");

    // Payload for token generation
    const payload = {
      id: response.id,
      userName: response.userName,
    };

    // Generate a token using the payload
    const token = generateToken(payload);
    console.log("Token is:", token);

    res.status(201).json({ response: response, token: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//login api
router.post("/login", async (req, res) => {
  try {
    //extract email and password from request body
    const { email, password } = req.body;

    //find user by email
    const profile = await Profile.findOne({ email: email });
    if (!profile) {
      return res.status(401).json({ message: "User not found" });
    }

    //if user does not exist or password does not match , return error
    if (!profile || !(await profile.comparePassword(password))) {
      return res.status(401).json({ error: "invalid email or password" });
    }
    //payload
    const payload = {
      id: profile.id,
      email: profile.email,
    };
    //generate a token using the payload
    const token = generateToken(payload);
    console.log("token is:", token);
    res.status(200).json({ token: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
