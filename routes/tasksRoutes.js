const express = require("express");
const router = express.Router();
const Tasks = require("../models/Tasks");

//TASKS APIs
//create task api
router.post("/createTasks", async (req, res) => {
  try {
    const newTask = new Tasks(req.body);
    const response = await newTask.save();
    console.log("tasks data is saved");
    res.status(200).json({ response: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

//update task
router.put("/updateTasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const updatedTask = await Tasks.findByIdAndUpdate(taskId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ response: updatedTask });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

//delete task
router.delete("/deleteTasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const deletedTask = await Tasks.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ response: deletedTask });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

//get all tasks
router.get("/getTasks", async (req, res) => {
  try {
    const tasks = await Tasks.find();
    res.status(200).json({ response: tasks });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
