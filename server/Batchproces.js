const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
// Set up Document AI client
const documentAIClient = new DocumentProcessorServiceClient();
const serviceAccountPath = path.join(__dirname, 'plenary-osprey-425621-b0-880c9d494fc7.json');
process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountPath;

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
            const projectId = 'plenary-osprey-425621-b0';
            const location = 'us'; // Adjust based on your setup
            const processorId = '257381c4fbe9fc96';

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
