const mongoose = require("mongoose");
require("dotenv").config();
const mongodbURL = process.env.MONGODB_URL;

mongoose.connect(mongodbURL, {
  // useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.log("Error connecting to MongoDB", err);
});

db.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

module.exports = db;
