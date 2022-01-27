const mongoose = require("mongoose");

const Data = mongoose.model(
  "Data",
  new mongoose.Schema({
    data: Object, 
    time: Number
  })
);

module.exports = Data;