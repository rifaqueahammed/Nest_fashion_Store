const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
  },
  isBlocked:{
    type:Boolean,
    default:false,
  }
});

module.exports = mongoose.model("category", categorySchema);