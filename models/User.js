// userSchema for all the fields we need for the use

const mongoose = require("mongoose");

const obj = {
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  }
};
const UserSchema = new mongoose.Schema(obj);

const User = mongoose.model("User", UserSchema);

module.exports = User;
