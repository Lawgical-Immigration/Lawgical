const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  employeeId: { type: String, required: true },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Complete'], default: 'Not Started' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  DOB: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  googleId: { type: String }, //oauth
  displayName: { type: String }, //oauth
  image: { type: String }, //oauth
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
