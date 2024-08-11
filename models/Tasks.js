const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//define the worker profile schema
const tasksSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  taskItems: [
    {
      itemName: { type: String, required: true },
      itemStatus: {
        type: String,
        enum: ["not completed", "completed"],
        required: true,
      },
    },
  ],
});
const Tasks = mongoose.model("Tasks", tasksSchema);

module.exports = Tasks;
