const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'category', 
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      stock: {
        type: Number,
        required: true,
      },
      isBlocked: {
        type: Boolean,
        default: false,
      },
  });
  
  module.exports = mongoose.model("product", productSchema);