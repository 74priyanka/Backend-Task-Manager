const express = require("express");
const router = express.Router();
const Tasks = require("../models/Tasks");
const { ObjectId } = require("mongodb");

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
router.put("/updateTasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { itemId } = req.query;
    console.log("request body : ", req.body);

    if (itemId) {
      const updateItem = await Tasks.updateOne(
        { _id: taskId, "taskItems._id": itemId },
        {
          $set: {
            "taskItems.$.itemName": req.body.itemName, // Update itemName
            "taskItems.$.itemStatus": req.body.itemStatus, // Update itemStatus
          },
        }
      );

      return res.status(200).json({ updateItem });
    }

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
router.delete("/deleteTasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { itemId } = req.query;

    if (itemId) {
      const deleteItem = await Tasks.findOneAndUpdate(
        { _id: taskId },
        { $pull: { taskItems: { _id: itemId } } },
        { new: true }
      );
      if (!deleteItem) {
        return res.status(404).json({ message: "item not found" });
      }

      return res.status(200).json({ deleteItem });
    }

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
router.get("/getTasks/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const tasks = await Tasks.find({ userId: userId }); // Query to find tasks by userId

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }
    res.status(200).json({ response: tasks });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

// replace task data based on taskId
// replace task data based on taskId
router.put("/replaceTasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const newTaskData = req.body;

    // Ensure the _id field is correct and not updated by the client
    if (newTaskData._id && newTaskData._id !== taskId) {
      return res
        .status(400)
        .json({
          message: "Task ID in request body does not match URL parameter",
        });
    }

    // Replace the existing task data with new data
    const updatedTask = await Tasks.findByIdAndUpdate(taskId, newTaskData, {
      new: true, // Return the updated document
      runValidators: true, // Validate against schema
      overwrite: true, // Replace the entire document
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

module.exports = router;
