const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const { PDFDocument } = require('pdf-lib');
const fs = require('node:fs');
const path = require('path');
require('dotenv').config();

const validateState = require('../utils/validateState');

const client = new DocumentProcessorServiceClient();
const projectId = process.env.PROJECT_ID;
const location = process.env.LOCATION;
const payStubProcessorId = process.env.PAYSTUB_PROCESSOR;

const jsonFieldMapping = fs.readFileSync(path.resolve(__dirname, '../utils/fieldMapping.json'));
const fieldMap = JSON.parse(jsonFieldMapping);


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

    const i129 = fs.readFileSync(path.join(__dirname, '../i-129-sample/Xfa_i-129-unlocked.pdf'));

    try {
      const pdfDoc = await PDFDocument.load(i129);
      const form = pdfDoc.getForm();

      const payStubData = res.locals.payStub;

      payStubData.forEach((data, fieldName) => {
        let field;
        
        if (fieldName.toLowerCase().includes('state')) {
          const state = validateState(data);
          const dropDown = form.getDropdown(fieldMap.paystub[String(fieldName)]);
          dropDown.select(state);

        } else {
          if (fieldName.toLowerCase().includes('zipcode')) {
            const zipCode = data.match(/^\d{5}/);
            data = zipCode[0];
          }
  
          if(fieldMap.paystub[String(fieldName)]) {
            field = form.getTextField(fieldMap.paystub[String(fieldName)]);
            if(field) field.setText(data);
          }
        }
        // populate 'United States of America' as country 
        const countryField = form.getTextField('form1[0].#subform[0].P1_Line3_Country[0]');
        countryField.setText('United States of America'); 
      });

      const newPdf = await pdfDoc.save();
      const firstName = payStubData.get('employee_first_name');
      const lastName = payStubData.get('employee_last_name');

      fs.writeFileSync(path.resolve(__dirname, `../i-129-sample/${firstName}_${lastName}_i129.pdf`), newPdf);

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