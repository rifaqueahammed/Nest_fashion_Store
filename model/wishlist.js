const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  products: [
    {
      productid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      product_name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("wishlist",wishlistSchema);
