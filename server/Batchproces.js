const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const dotenv = require('dotenv');
dotenv.config();

// Set up Document AI client
const documentAIClient = new DocumentProcessorServiceClient();
const serviceAccountPath = path.join(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Ensure the path is printed correctly for debugging
console.log('Service account path:', serviceAccountPath);
// Function to process documents in the uploads directory
async function processDocumentsInUploads() {
    try {
        const uploadsDir = path.join(__dirname, 'uploads');
        const files = fs.readdirSync(uploadsDir);

        for (let file of files) {
            const filePath = path.join(uploadsDir, file);
            console.log(filePath)
            console.log("___________________")
            
            const fileData = fs.readFileSync(filePath);
            console.log(fileData)  
            // Prepare the Document AI request
            const projectId = process.env.PROJECT_ID;
            const location = 'us'; // Adjust based on your setup
            const processorId = process.env.PROCESSOR_ID;

            const request = {
                name: `projects/${projectId}/locations/${location}/processors/${processorId}`,
                rawDocument: {
                    content: fileData.toString('base64'),
                    mimeType: mime.lookup(filePath) || 'application/pdf',
                },
            };
            
            // Process the document
            const [result] = await documentAIClient.processDocument(request);
            console.log('Document processed:', result);

            
        }

        console.log('All files processed successfully.');
    } catch (error) {
        console.error('Error processing files:', error);
    }
}

processDocumentsInUploads();
