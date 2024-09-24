const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const { PDFDocument } = require('pdf-lib');
const fs = require('node:fs');
const path = require('path');
require('dotenv').config();

const client = new DocumentProcessorServiceClient();
const projectId = process.env.PROJECT_ID;
const location = process.env.LOCATION;
const payStubProcessorId = process.env.PAYSTUB_PROCESSOR;


const documentController = {
  parseDocument: async(req, res, next) => {
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
    
    const name = `projects/${projectId}/locations/${location}/processors/${payStubProcessorId}`;
    const encodedImage = imgFile.buffer.toString('base64');
  
    const request = {
      name,
      rawDocument: {
        content: encodedImage,
        mimeType: imgFile.mimetype
      }
    }
    
    try {
      const [ result ] = await client.processDocument(request);
      const { document } = result;
      
      const payStubData = new Map();
    
      for (const data of document.entities) {
        payStubData.set(data.type, data.mentionText)
      }

      res.locals.payStub = payStubData;
      return next();

    } catch (error) {
      return next({
        log: `Error in documentController.parseDocument. ERR: ${error}`,
        status: 500,
        message: {err: `Error parsing uploaded document. Please try again.`}
      })
    }
  },

  fillDocument: async(req, res, next) => {

    const i129 = fs.readFileSync(path.join(__dirname, '../../i-129-unlocked.pdf'));

    try {
      const pdfDoc = await PDFDocument.load(i129);
      const form = pdfDoc.getForm();
      const fields = form.getFields()

      fields.forEach(field => {
        const type = field.constructor.name;
        const name = field.getName();
        const fieldName = form.getField(name);

        console.log('filedName: ', fieldName, 'field: ', name, 'type: ', type);
      });

      return next();

    } catch (error) {
      return next({
        log: `Error in documentController.fillDocument. ERR: ${error}`,
        status: 422,
        message: {err: `Error processing i-129 form. Please try again.`}
      })
    }
  }
  
}

module.exports = documentController;