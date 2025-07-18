const mongoose = require("mongoose");
const { type } = require("os");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TodoModel = mongoose.model("Todo", todoSchema);
module.exports = TodoModel;
