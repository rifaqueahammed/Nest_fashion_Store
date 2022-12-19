const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  deliveryAddress: {
    addressline1: {
      type: String,
    },
    addressline2: {
      type: String,
      default: "",
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
    },
  },

  orderItems: [
    {
      productid: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
      },
      quantity: {
        type: Number,
        // required: true,
      },
    },
  ],

  totalAmount: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    default: "Not Paid",
  },
  orderDate: {
    type: String,
  },
  deliveryDate: {
    type: String,
  },
  discount: {
    type: Number,
  },
});

module.exports = mongoose.model("order", orderSchema);
