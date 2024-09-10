// Main server file for the Lawgical application. It handles various functionalities such as sending emails, uploading files, processing passports, and filling PDF forms. It uses various libraries like express, nodemailer, multer, aws-sdk, and pdf-lib. The server listens on a specific port and handles HTTP requests.
const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();
const http = require("http");

const employeeRouter = require('./routers/employeeRouter');
const uploadRouter = require('./routers/uploadRouter'); 

const app = express();
const PORT = process.env.PORT || 5050;
const server = http.createServer(app);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

//serve static files
app.use(express.static(path.join(__dirname, '../employee-details-frontend/public')));

//employee routes
app.use('/employee', employeeRouter);

//upload routes
app.use('/upload', uploadRouter);

//error handling
app.use((err, req, res, next) => {
  const defaultErr = {
    log: `Express error handler caught unknown middleware error. ERR: ${err}`,
    status: 400,
    message: {err: 'An error occured. See server log for details.'}
  };
  const errObj = Object.assign(defaultErr, err);
  console.log(errObj.log);
  return res.status(errObj.status).json(errObj.message)
})

//start server
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