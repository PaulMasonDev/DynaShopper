const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
  name: {type: String, default: 'default'},
  items: [String]
});

module.exports = mongoose.model("List", ListSchema);