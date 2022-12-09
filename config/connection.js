/* eslint-disable no-console */
// Import the mongoose module
const mongoose = require("mongoose");

// Set up default mongoose connection

module.exports = () => {
  const uri = process.env.MONGO_URI;
  mongoose
    .connect(uri)
    .then(() => {
      console.log(`Databse connected`);
    })
    .catch((err) => {
      console.log(`Database connection failed : ${err}`);
    });
};
