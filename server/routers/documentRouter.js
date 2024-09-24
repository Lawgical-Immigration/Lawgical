const express = require('express');
const multer = require('multer');

require('dotenv').config();

const router = express.Router();
const upload = multer();

const { parseDocument, fillDocument } = require('../controllers/documentController')


router.post('/:employee_id', upload.single('paystub'),  fillDocument, (req, res) => {
  return res.sendStatus(201);
})

module.exports = router;