const Employee = require('../models/employeeModel');
;

const crypto = require("crypto");

const employeeController = {

  getEmployee: async(req, res, next) => {
    try {
      const employees = await Employee.find({}, 'status firstName lastName DOB email country').exec();

      res.locals.employeeList = employees;
      return next();
    } catch (error) {
      return next({
        log: `Error in getEmployee middleware. ERR: ${error}`,
        message: {err: `Error retrieving employees.`}
      })
    }
  },

  addEmployee: async(req, res, next) => {
    const { firstName, lastName, DOB, email, country } = req.body;
    const newEmployee = { firstName, lastName, DOB, email, country };

    let empId = null;

    while (empId === null) {
      const tempId = crypto.randomBytes(16).toString('hex');
      const checkIfExists = await Employee.find({employeeId: tempId});

      if(checkIfExists.length === 0) empId = tempId;
    }
    
    newEmployee.employeeId = empId;
  
    try {
      const addEmployee = await Employee.create(newEmployee);
      const {firstName, lastName} = addEmployee;
  
      res.locals.newEmployeeName = `${firstName} ${lastName}`;
  
      return next();
    } catch (error) {
      return next({
        log: `Error in addEmployee middleware. ERR: ${error}`,
        status: 406,
        message: {err: 'Error adding employee.'}
      })
    }
  }
};

module.exports = employeeController;