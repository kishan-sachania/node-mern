const { uniqueId } = require("lodash");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    uniqueId: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
