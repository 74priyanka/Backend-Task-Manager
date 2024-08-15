const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

app.use(
  cors({
    origin: "http://localhost:3001/", // Replace with your frontend domain
  })
);

//importing router files
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const tasksRoutes = require("./routes/tasksRoutes");

app.use(bodyParser.json()); //req.body
require("dotenv").config();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("api is working for simple task manager");
});

//using routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/tasks", tasksRoutes);

app.listen(port, () => {
  console.log("server is running on port 3000");
});
