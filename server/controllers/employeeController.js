const Employee = require('../models/employeeModel');
;

const crypto = require("crypto");

const employeeController = {};

employeeController.addEmployee = async(req, res, next) => {
  
  const { firstName, lastName, DOB, email, country } = req.body;
  const newEmployee = { firstName, lastName, DOB, email, country };
  newEmployee.employeeId = crypto.randomBytes(16).toString('hex');

  try {
    const addEmployee = await Employee.create(newEmployee);
    const {firstName, lastName} = addEmployee;

    res.locals.newEmployeeName = `${firstName} ${lastName}`;

    return next();
  } catch (error) {
    return next({
      log: `Error in employeeController.addEmployee. ERR: ${error}`,
      status: 406,
      message: {err: 'Error adding employee.'}
    })
  }
}

module.exports = employeeController;