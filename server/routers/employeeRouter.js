const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/employeeController');

router.post('/', employeeController.addEmployee, (_, res) => {
  return res.status(201).json(`${res.locals.newEmployeeName} successfully added to the database.`)
})

module.exports = router;