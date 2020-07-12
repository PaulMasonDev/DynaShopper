const mongoose = require("mongoose");

const MasterListSchema = new mongoose.Schema({
  name: {type: String, default: ''},
  items: [String],
});

module.exports = mongoose.model("MasterList", MasterListSchema);