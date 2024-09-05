const { Storage } = require('@google-cloud/storage');
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

require('dotenv').config();

// Configuration
const projectId = '';
const location ='';
const bucketName = '';
const visaProcessorId = '';
const i94 = '';
const passport = ''
// Add other processors as needed

// Initialize clients
const storage = new Storage();
const documentAIClient = new DocumentProcessorServiceClient();
const upload = multer({ storage: multer.memoryStorage() });
const serviceAccountPath = path.join(__dirname, '');
process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountPath;
app.post('/upload', upload.array('documents', 12), async (req, res) => {
  try {
    const files = req.files;
    const personName = req.body.personName; // Assuming the person's name is sent in the request body
    
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

      // Determine the processor based on the file type using if-else conditions
      let processorId;
      if (fileName.toLowerCase().includes('visa')) {
        processorId = visaProcessorId;
      } else if (fileName.toLowerCase().includes('i94')) {
        processorId = i94;
      } else if(fileName.toLowerCase().includes('passport')){
        processorId=passport
      } 
      else {
        // Add other conditions for different file types
        console.log(`No processor found for ${fileName}, skipping...`);
        continue;
      }

      const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
      const gcsUri = `gs://${bucketName}/${filePath}`;
      console.log(`GCS URI: ${gcsUri}`);
      // Create the request with the inline content
      const encodedContent = file.buffer.toString('base64');
      const request = {
        name,
        rawDocument: {
        content: encodedContent,
          mimeType: file.mimetype,
        },
        labelsMap: [{ 'key': 'value' }],
      };

      // Process the document
      try {
        // Process the document
        const [result] = await documentAIClient.processDocument(request);
        console.log(result.document)
        const finalResult = result.document.entities;
        
        // Extract and store the data
        function extractAllTypes(data) {
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
        }

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


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
