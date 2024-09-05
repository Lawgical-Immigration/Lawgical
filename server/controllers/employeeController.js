// const Employee = require('../models/employeeModel');
const supabase = require('../../database/dbConfig');
const crypto = require("crypto");

const employeeController = {

  getEmployeeInfo: async(req, res, next) => {
    const { firstName, lastName, email } = req.body;
    const { uniqueId } = req.params;

    const { data, error } = await supabase.from('employees').select().or(`and.first_name.eq.${firstName},last_name.eq.${lastName},email.eq.${email},or.employee_id.eq.${uniqueId}`);

    if(error) {
      return next({
        log: `Error in employeeController.getEmployeeId middleware. ERR: ${error}`,
        message: {err: 'Error fetching employee data. See server log for details.'}
      })
    } else if(data.length === 0) {
      return next({
        log: `Employee not found in the database.`,
        status: 404,
        message: {err: 'Employee not found. Please try again.'}
      })
    } else {
      const employee = data[0];
      res.locals = employee;
      return next();
    }
  },

  getAllEmployees: async(_, res, next) => {

    const { data, error } = await supabase.from('employees').select('_status, first_name, last_name, dob, email, country');

    if(error) {
      return next({
        log: `Error in employeeController.getAllEmployees middleware. ERR: ${error}`,
        message: {err: 'Error fetching employees. See server log for details.'}
      })
    } else {
      res.locals.employeeList = data;
      return next();
    }
  },

  addEmployee: async(req, res, next) => {
    const { firstName, lastName, DOB, email, country } = req.body;

    let empId = null;

    while (empId === null) {
      const tempId = crypto.randomBytes(16).toString('hex');
      
      const { data, error } = await supabase.from('employees').select().eq('employee_id', tempId);
      console.log('data: ', data, 'error: ', error)

      if(data.length === 0) empId = tempId;
    };

    const { error } = await supabase.from('employees').insert({employee_id: empId, first_name: firstName, last_name: lastName, dob: DOB, email: email, country: country});

    if(error) {
      return next({
        log: `Error in addEmployee middleware. ERR: ${error}`,
        status: 406,
        message: {err: 'Error adding employee.'}
      })
    } else {
      res.locals.newEmployeeName = `${firstName} ${lastName}`;
      return next();
    }
  }
};

module.exports = employeeController;