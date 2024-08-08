const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  id: {type: String, required: true},
  immigrantStatus: {type: Boolean, default: false}
});

module.exports = mongoose.model("User", userSchema);
