const express = require('express');
const router = express.Router();

const { getAllEmployees, addEmployee} = require('../controllers/employeeController');

router.get('/', getAllEmployees, (req, res) => {
  return res.status(200).json(res.locals.employeeList);
})

router.post('/', addEmployee, (req, res) => {
  return res.status(201).json(`${res.locals.newEmployeeName} successfully added to the database.`)
})

module.exports = router;