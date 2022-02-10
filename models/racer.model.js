const mongoose = require("mongoose");

const Data = mongoose.model(
  "Racers",
  new mongoose.Schema({
    number: Number, 
    discordId: String, 
    nickName: String
  })
);

module.exports = Data;