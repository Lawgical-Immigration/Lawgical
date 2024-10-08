const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig'); 

const {
  getAllEmployees,
  addEmployee,
  sendEmail,
  uploadFile,
  getEmployeeInfo
} = require('../controllers/employeeController');


//get all employees
router.get('/', getAllEmployees, (req, res) => {
  return res.status(200).json(res.locals.employeeList);
});

//add a new employee
router.post('/', addEmployee, (req, res) => {
  return res.status(201).json(`${res.locals.newEmployeeName} successfully added to the database.`);
});

//send an email
router.post('/email/:employee_id', getEmployeeInfo, sendEmail, (req, res) => {
  return res.status(200).send('Email sent: ' + res.locals.infoResponse);
});

//upload a file
router.post('/:employee_id', upload.single('file'), getEmployeeInfo, uploadFile, (req, res) => { 
  res.status(200).send('File uploaded, processed, and email sent: ' + res.locals.infoResponse);
});


router.get('/:employee_id', getEmployeeInfo, (req, res) => {
  console.log('Employee route registered');

  if (!res.locals.employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  return res.status(200).json(res.locals.employee);
});

router.get('/', getEmployeeInfo, (req, res) => {
  if (!res.locals.employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  return res.status(200).json(res.locals.employee);
});

module.exports = router;