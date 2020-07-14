const mongoose = require("mongoose");

const PersonalListSchema = new mongoose.Schema({
  name: {type: String, default: 'default'},
  items: [String],
  author: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});

module.exports = mongoose.model("PersonalList", PersonalListSchema);