const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose
db.data = require("./datatest.model");
db.racer = require("./racer.model");
// db.carnumbers = require("./carnumbers.model");

module.exports = db;