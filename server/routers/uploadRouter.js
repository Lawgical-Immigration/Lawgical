const express = require('express');
const { Storage } = require('@google-cloud/storage');
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const multer = require('multer');

// Load environment variables
require('dotenv').config();

const router = express.Router();

// Configuration
const projectId = process.projectId;
const location = process.env.location;
const bucketName = process.env.bucket;
const visaProcessorId = process.env.visaProcessorId;
const i94 = process.env.i94;
const passport = process.env.passport;

// Initialize clients
const storage = new Storage();
const documentAIClient = new DocumentProcessorServiceClient();
const upload = multer({ storage: multer.memoryStorage() });

// Upload and process documents route
router.post('/', upload.array('documents', 12), async (req, res) => {
  try {
    console.log('in the upload middleware')
    const files = req.files;
    const personName = req.body.personName;

    if (!personName) {
      return res.status(400).send('Person name is required');
    }

    const folderPath = `${personName}`;
    const extractedData = {};

    // Upload each file to Google Cloud Storage and process it
    for (const file of files) {
      const fileName = file.originalname;
      const filePath = `${folderPath}/${fileName}`;

      // Upload to GCS
      const bucket = storage.bucket(bucketName);
      const fileUpload = bucket.file(filePath);
      await fileUpload.save(file.buffer, { resumable: false });
      console.log(`${fileName} uploaded to ${bucketName}/${folderPath}/`);

      // Determine the processor based on file type
      let processorId;
      if (fileName.toLowerCase().includes('visa')) {
        processorId = visaProcessorId;
      } else if (fileName.toLowerCase().includes('i94')) {
        processorId = i94;
      } else if (fileName.toLowerCase().includes('passport')) {
        processorId = passport;
      } else {
        console.log(`No processor found for ${fileName}, skipping...`);
        continue;
      }

      const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
      const encodedContent = file.buffer.toString('base64');
      const request = {
        name,
        rawDocument: {
          content: encodedContent,
          mimeType: file.mimetype,
        },
      };

      try {
        const [result] = await documentAIClient.processDocument(request);
        const finalResult = result.document.entities;

        // Extract and store the data
        const extractAllTypes = (data) => {
          const result = {};
          data.forEach(item => {
            if (item.type && item.mentionText) {
              if (!result[item.type]) {
                result[item.type] = [];
              }
              result[item.type].push(item.mentionText);
            }
          });
          return result;
        };

        const data = extractAllTypes(finalResult);
        extractedData[fileName] = data;
      } catch (processError) {
        console.error(`Error processing document ${fileName}:`, processError);
      }
    }

    res.json(extractedData);
  } catch (error) {
    console.error('Error processing documents:', error);
    res.status(500).send('Error processing documents');
  }
});

module.exports = router;
