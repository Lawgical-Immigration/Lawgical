// This file is responsible for extracting data from a passport PDF using Google Cloud Document AI. It reads the PDF, extracts text, and then extracts specific fields like passport number, name, nationality, sex, date of birth, date of issue, and date of expiry. The extracted data is then saved to a text file.

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const projectId = '';
const location = 'us'; // Format is 'us' or 'eu'
const processorId = ''; // Create processor in Cloud Console
const filePath = 'passport.pdf';
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const {DocumentProcessorServiceClient} =
  require('@google-cloud/documentai').v1;
const fs = require('fs').promises;
//   // Instantiates a client
//   // apiEndpoint regions available: eu-documentai.googleapis.com, us-documentai.googleapis.com (Required if using eu based processor)
//const client = new DocumentProcessorServiceClient({apiEndpoint: 'eu-documentai.googleapis.com'});
const client = new DocumentProcessorServiceClient();
  
async function quickstart() {
//     // The full resource name of the processor, e.g.:
//     // projects/project-id/locations/location/processor/processor-id
//     // You must create new processors in the Cloud Console first
     const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
  
//     // Read the file into memory.
    const imageFile = await fs.readFile(filePath);
  
//     // Convert the image data to a Buffer and base64 encode it.
    const encodedImage = Buffer.from(imageFile).toString('base64');
  
    const request = {
      name,
      rawDocument: {
        content: encodedImage,
        mimeType: 'application/pdf',
      },
    };
  
//     // Recognizes text entities in the PDF document
    const [result] = await client.processDocument(request);
    const { document } = result;
  
//     // Get all of the document text as one big string
    const { text } = document;
    console.log("text:", text)
//     // Extract shards from the text field
    const getText = textAnchor => {
      if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
        return '';
      }
  
      // First shard in document doesn't have startIndex property
      const startIndex = textAnchor.textSegments[0].startIndex || 0;
      const endIndex = textAnchor.textSegments[0].endIndex;
  
      return text.substring(startIndex, endIndex);
    };
  
//     // Function to extract specific fields from the document text
    const extractField = (fieldName) => {
      const regex = new RegExp(`${fieldName}:?\\s*([^\\n]+)`, 'i');
      const match = text.match(regex);
      return match ? match[1].trim() : null;
    };
  
//     // Extracting specific fields
    const passportNumber = extractField('Passport No.');
    const Name = extractField('Name');
    const nationality = extractField('Nationality');
    const sex = extractField('Sex');
    const dateOfBirth = extractField('Date of birth');
    const dateOfIssue = extractField('Date of issue');
    const dateOfExpiry = extractField('Date of expiry');
  
    // Printing extracted fields
    console.log('Extracted Passport Details:');
    console.log(`Passport Number: ${passportNumber}`);
    console.log(`Name: ${Name}`);
    console.log(`Nationality: ${nationality}`);
    console.log(`Sex: ${sex}`);
    console.log(`Date of Birth: ${dateOfBirth}`);
    console.log(`Date of Issue: ${dateOfIssue}`);
    console.log(`Date of Expiry: ${dateOfExpiry}`);
  
//     // Save the output to a file
    const output = `
      Passport Number: ${passportNumber}
      Name: ${Name}
      Nationality: ${nationality}
      Sex: ${sex}
      Date of Birth: ${dateOfBirth}
      Date of Issue: ${dateOfIssue}
      Date of Expiry: ${dateOfExpiry}
    `;
    await fs.writeFile('passport_details.txt', output);
  }
  
   quickstart()