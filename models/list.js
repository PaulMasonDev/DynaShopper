const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
  name: {type: String, default: 'default'},
  items: [String],
  author: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});

module.exports = mongoose.model("List", ListSchema);