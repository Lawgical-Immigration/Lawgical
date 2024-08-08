// Main server file for the Lawgical application. It handles various functionalities such as sending emails, uploading files, processing passports, and filling PDF forms. It uses various libraries like express, nodemailer, multer, aws-sdk, and pdf-lib. The server listens on a specific port and handles HTTP requests.
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const aws = require("aws-sdk");
const _ = require("lodash");
const { PDFDocument } = require("pdf-lib");
const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const socketIo = require('socket.io');
const setupWebSocket = require('./chatbotWebSocket');
const mongoose = require("mongoose");
mongoose.connect(process.env.MDB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Connected to database");
});

const User = require("./employee-details-frontend/src/Models/userModel");
const Conversation = require("./employee-details-frontend/src/Models/conversationModel");
const Message = require("./employee-details-frontend/src/Models/messageModel");

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type'],
    credentials: true // Allow credentials if needed
  }
})
setupWebSocket(io);

app.use(bodyParser.json());
app.use(cors())

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lawgical.immigration@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const textract = new aws.Textract();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage });
// In-memory store for email addresses

app.post("/send-email", async (req, res) => {
  const { name, email } = req.body;
  const employee =
    (await User.findOne({ name, email })) ||
    (await User.create({
      name,
      email,
      id: crypto.randomBytes(16).toString("hex"),
    }));
  const uniqueId = employee.id;
  const uploadLink = `http://localhost:3000/upload/${uniqueId}`;
  console.log("employee: ", employee);
  const mailOptions = {
    from: "lawgical.immigration@gmail.com",
    to: email,
    subject: "🎉 Congratulations! Let’s Get Started on Your Visa Application!",
    text: `Hello ${name},\n\nGreat news! Your employer is excited to sponsor your visa! 🎉Ready to begin? Click the link below to start your immigration journey:\n\n${uploadLink}\n\nWe’re here to make this process as smooth and easy as possible. If you have any questions along the way, you can chat 24/7 with an immigration expert. While you wait, our AI will provide you with quick answers.\n\nBest regards,\nTeam Lawgical.`,
  };
  try {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res
        .status(200)
        .send(
          "Email sent: " +
            info.response +
            " and employee created in the database: " +
            employee
        );
    });
  } catch (err) {
    res.status(500);
  }
});

app.post("/upload/:uniqueId", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const { uniqueId } = req.params;
  const employeeDoc = await User.findOne({ id: uniqueId });
  const email = employeeDoc && employeeDoc.email;
  console.log("id: ", uniqueId);
  console.log("email is : ", email);
  try {
    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath);
    const extractedData = await processPassport(fileContent);
    const outputFilePath = path.join(
      "output",
      `${path.basename(filePath, path.extname(filePath))}.json`
    );

    // Ensure output directory exists
    if (!fs.existsSync("output")) {
      fs.mkdirSync("output");
    }

    fs.writeFileSync(
      outputFilePath,
      JSON.stringify(extractedData, null, 2),
      "utf8"
    );
    console.log(`Extracted data saved to ${outputFilePath}`);

    // Fill the PDF form with the extracted data
    const filledPdfPath = "output/filled_form.pdf";
    await fillPdfForm(
      "Xfa_i-129-unlocked.pdf",
      filledPdfPath,
      extractedData,
      fieldMapping
    );

    // Send the filled PDF via email
    const mailOptions = {
      from: "lawgical.immigration@gmail.com",
      to: email, // Replace with recipient email
      subject:
        "📋 Action Required: Jessica`s Completed Visa Form is Ready for Review",
      text: "Hello Jessica,\nExciting news! The first version of visa form is ready for your review. 📋\nPlease review and finalize the details.\nYour expertise is crucial to ensure everything is accurate and complete. If you need any further information or assistance, simply respond to this email.\nBest,\nTeam Lawgical",
      attachments: [
        {
          filename: "filled_I129_form.pdf",
          path: filledPdfPath,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res
        .status(200)
        .send("File uploaded, processed, and email sent: " + info.response);
    });
  } catch (error) {
    console.error(`Error processing file: ${error}`);
    res.status(500).send("Error processing file.");
  }
});

app.get("/api/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("successfully fetched user: ", user)
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error", err });
  }
});


app.get("/conversations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const convo = (
      await Conversation.findOne({ user: userId }) ||
      await Conversation.create({ user: userId })
    );
    const messages = await Message.find({ conversation: convo._id });
    res.status(200).json({ convoID: convo._id, messages: messages});
  } catch (err) {
    console.log("error in retrieving conversations: ", err);
    res.status(500).json({ message: "Server error", err });
  }
});

const getText = (result, blocksMap) => {
  let text = "";
  if (_.has(result, "Relationships")) {
    result.Relationships.forEach((relationship) => {
      if (relationship.Type === "CHILD") {
        relationship.Ids.forEach((childId) => {
          const word = blocksMap[childId];
          if (word.BlockType === "WORD") {
            text += `${word.Text} `;
          }
          if (
            word.BlockType === "SELECTION_ELEMENT" &&
            word.SelectionStatus === "SELECTED"
          ) {
            text += "X";
          }
        });
      }
    });
  }
  return text.trim();
};

const correctOcrErrors = (text) => {
  return text.replace(/([A-Z]) 1/g, "$1");
};

const correctOcrErrors1 = (text) => {
  return text.replace(/.*\/\s*/, "");
};

const findValueBlock = (keyBlock, valueMap) => {
  let valueBlock;
  keyBlock.Relationships.forEach((relationship) => {
    if (relationship.Type === "VALUE") {
      relationship.Ids.every((valueId) => {
        if (_.has(valueMap, valueId)) {
          valueBlock = valueMap[valueId];
          return false;
        }
      });
    }
  });
  return valueBlock;
};

const getKeyValueRelationship = (keyMap, valueMap, blockMap) => {
  const keyValues = {};
  const keyMapValues = _.values(keyMap);
  keyMapValues.forEach((keyMapValue) => {
    const valueBlock = findValueBlock(keyMapValue, valueMap);
    let key = getText(keyMapValue, blockMap);
    let value = getText(valueBlock, blockMap);
    key = correctOcrErrors1(key);
    value = correctOcrErrors(value);
    keyValues[key] = value;
  });
  return keyValues;
};

const getKeyValueMap = (blocks) => {
  const keyMap = {};
  const valueMap = {};
  const blockMap = {};
  let blockId;
  blocks.forEach((block) => {
    blockId = block.Id;
    blockMap[blockId] = block;
    if (block.BlockType === "KEY_VALUE_SET") {
      if (_.includes(block.EntityTypes, "KEY")) {
        keyMap[blockId] = block;
      } else {
        valueMap[blockId] = block;
      }
    }
  });
  return { keyMap, valueMap, blockMap };
};

const processPassport = async (buffer) => {
  const params = {
    Document: {
      Bytes: buffer,
    },
    FeatureTypes: ["FORMS"],
  };
  const request = textract.analyzeDocument(params);
  const data = await request.promise();
  if (data && data.Blocks) {
    const { keyMap, valueMap, blockMap } = getKeyValueMap(data.Blocks);
    const keyValues = getKeyValueRelationship(keyMap, valueMap, blockMap);
    return keyValues;
  }
  return undefined;
};

const fillPdfForm = async (
  inputPdfPath,
  outputPdfPath,
  formData,
  fieldMapping
) => {
  const existingPdfBytes = fs.readFileSync(inputPdfPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();
  Object.keys(formData).forEach((key) => {
    const fieldName = fieldMapping[key];
    if (fieldName) {
      const field = form.getTextField(fieldName);
      if (field) {
        field.setText(formData[key]);
      } else {
        console.warn(`Field "${fieldName}" not found in the PDF form`);
      }
    } else {
      console.warn(`No mapping found for key "${key}"`);
    }
  });
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPdfPath, pdfBytes);
};

const fieldMapping = {
  "Given Name(s)": "form1[0].#subform[0].Line1_GivenName[0]",
  Surname: "form1[0].#subform[0].Line1_FamilyName[0]",
};

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// --------------------------------------Gusto Implementation --------------------------------------------------
// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 8000;

// // Store your access token and company UUID
// const ACCESS_TOKEN = '2K0JR-d3lSvWm3DvHKL5jY1qAlZjW8btE4tvrVtSO_4'; // Replace with your actual access token
// const COMPANY_UUID = '689e95c7-ce43-49fe-8149-5be705615e76'; // Replace with your actual company UUID
// const COMPANY_URL = `https://api.gusto-demo.com/v1/companies/${COMPANY_UUID}`;
// const EMPLOYEES_URL = `https://api.gusto-demo.com/v1/companies/${COMPANY_UUID}/employees`;

// app.use(cors());

// // Endpoint to fetch company details
// app.get('/company', async (req, res) => {
//     try {
//         const response = await axios.get(COMPANY_URL, {
//             headers: {
//                 'Authorization': `Bearer ${ACCESS_TOKEN}`
//             }
//         });
//         res.json(response.data);
//     } catch (error) {
//         console.error('Error fetching company details:', error.response ? error.response.data : error.message);
//         res.status(error.response ? error.response.status : 500).send('Failed to fetch company details');
//     }
// });

// // Endpoint to fetch employee details
// app.get('/employees', async (req, res) => {

//     try {
//         const response = await axios.get(EMPLOYEES_URL, {
//             headers: {
//                 'Authorization': `Bearer ${ACCESS_TOKEN}`
//             }
//         });

//         res.json(response.data);
//     } catch (error) {
//         console.error('Error fetching employees:', error.response ? error.response.data : error.message);
//         res.status(error.response ? error.response.status : 500).send('Failed to fetch employees');
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
//----------------------------------------------------------------------------------------------------------------
