const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  mobile_number: {
    type: Number,
    required: true,
    unique: true,
    min: 10,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("user", userSchema);
