const express = require('express');
const multer = require('multer');
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;

require('dotenv').config();

const router = express.Router();
const upload = multer();

const client = new DocumentProcessorServiceClient();

const projectId = process.env.PROJECT_ID;
const location = process.env.LOCATION;
const payStubProcessorId = process.env.PAYSTUB_PROCESSOR;

router.post('/:employee_id', upload.single('paystub'), async(req, res, next) => {
  let imgFile;

  if (req.file) {
    imgFile = req.file
  } else {
    return next({
      log: `Error uploading document. No file uploaded.`,
      status: 422,
      message: {err: 'Error uploading document. Please try again.'} 
    })
  }
  
  console.log('imgFile: ', imgFile);
  
  const name = `projects/${projectId}/locations/${location}/processors/${payStubProcessorId}`;
  const encodedImage = imgFile.buffer.toString('base64');

  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType: imgFile.mimetype
    }
  }

  const [ result ] = await client.processDocument(request);
  const { document } = result;

  // console.log('processed document: ', document);

  const payStubData = new Map();

  for (const data of document.entities) {
    payStubData.set(data.type, data.mentionText)
  }

  console.log('paystubData: ', payStubData)
  
  return res.sendStatus(201);
})

module.exports = router;