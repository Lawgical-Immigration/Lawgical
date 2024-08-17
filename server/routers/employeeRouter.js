const express = require('express');
const router = express.Router();

const { getEmployee, addEmployee} = require('../controllers/employeeController');

router.get('/', getEmployee, (_, res) => {
  return res.status(200).json(res.locals.employeeList);
})

router.post('/', addEmployee, (_, res) => {
  return res.status(201).json(`${res.locals.newEmployeeName} successfully added to the database.`)
})

module.exports = router;