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
  isBlocked: {
    type: Boolean,
    default: false,
  },

  permanentAddress: {
    gender: {
      type: String,
    },
    housename: {
      type: String,
      default: "",
    },
    area: {
      type: String,
    },
    landmark: {
      type: String,
    },
    district: {
      type: String,
    },
    state: {
      type: String,
    },
    postoffice: {
      type: String,
    },
    pincode: {
      type: String,
      default: "",
    },
    country: {
      type: String,
    },
  },
});

module.exports = mongoose.model("user", userSchema);
