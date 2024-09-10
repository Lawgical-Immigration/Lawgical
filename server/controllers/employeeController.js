const supabase = require('../../database/dbConfig');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const transporter = require('../config/nodemailerConfig');
const fieldMapping = require('../config/fieldMapping');
const { processPassport } = require('../services/ocrService');
const { processPdf } = require('../services/pdfService');

const employeeController = {
  getEmployeeInfo: async (req, res, next) => {
    const { firstName, lastName, email } = req.body;
    console.log('req.params', req.params);
    const { employee_id } = req.params;

    try {
      const { data, error } = await supabase
      .from('employees')
      .select('*')  // Replace '*' with specific column names if needed
      .eq('employee_id', employee_id);  // Filter by employee_id
        // .or(`and.first_name.eq.${firstName},last_name.eq.${lastName},email.eq.${email},or.employee_id.eq.${employee_id}`);
      
      if (error) {
        return next({
          log: `Error in employeeController.getEmployeeInfo middleware. ERR: ${error}`,
          message: { err: 'Error fetching employee data. See server log for details.' },
        });
      } else if (data.length === 0) {
        return next({
          log: `Employee not found in the database.`,
          status: 404,
          message: { err: 'Employee not found. Please try again.' },
        });
      } else {
        const employee = data[0];
        res.locals.employee = employee;
        return next();
      }
    } catch (err) {
      return next({
        log: `Error in employeeController.getEmployeeInfo middleware. ERR: ${err.message}`,
        message: { err: 'Error occurred while processing the request.' },
      });
    }
  },

  getAllEmployees: async (_, res, next) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('');

      if (error) {
        return next({
          log: `Error in employeeController.getAllEmployees middleware. ERR: ${error}`,
          message: { err: 'Error fetching employees. See server log for details.' },
        });
      } else {
        res.locals.employeeList = data;
        return next();
      }
    } catch (err) {
      return next({
        log: `Error in employeeController.getAllEmployees middleware. ERR: ${err.message}`,
        message: { err: 'Error occurred while fetching employees.' },
      });
    }
  },

  addEmployee: async (req, res, next) => {
    const { firstName, lastName, DOB, email, country } = req.body;
    let empId = null;
    console.log('addEmployee', req.body);
    try {
      while (empId === null) {
        const tempId = crypto.randomBytes(16).toString('hex');
        const { data, error } = await supabase.from('employees').select().eq('employee_id', tempId);
        if (error) {
          return next({
            log: `Error in employeeController.addEmployee middleware. ERR: ${error}`,
            message: { err: 'Error generating employee ID.' },
          });
        }
        if (data.length === 0) empId = tempId;
      }

      const { error } = await supabase.from('employees').insert({
        employee_id: empId,
        first_name: firstName,
        last_name: lastName,
        dob: DOB,
        email: email,
        country: country,
      });

      if (error) {
        return next({
          log: `Error in addEmployee middleware. ERR: ${error}`,
          status: 406,
          message: { err: 'Error adding employee.' },
        });
      } else {
        res.locals.newEmployeeName = `${firstName} ${lastName}`;
        return next();
      }
    } catch (err) {
      return next({
        log: `Error in employeeController.addEmployee middleware. ERR: ${err.message}`,
        message: { err: 'Error occurred while adding the employee.' },
      });
    }
  },

  sendEmail: async (req, res, next) => {
    const { firstName, email } = req.body;
    const { employee_id } = res.locals.employee;
    const uploadLink = `http://localhost:3000/upload/${employee_id}`;

    const mailOptions = {
      from: 'lawgical.immigration@gmail.com',
      to: email,
      subject: "🎉 Congratulations! Let’s Get Started on Your Visa Application!",
      text: `Hello ${firstName},\n\nGreat news! Your employer is excited to sponsor your visa! 🎉Ready to begin? Click the link below to start your immigration journey:\n\n${uploadLink}\n\nBest regards,\nTeam Lawgical.`,
    };

    try {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send(error.toString());
        }
        // return next();
        res.locals.infoRepsonse = info.response;
        return next();
      });
    } catch (err) {
      res.status(500).send('Error sending email.');
    }
  },

  uploadFile: async (req, res, next) => {
    console.log('inside uploadFile');
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const { email } = res.locals.employee;

    try {
      const filePath = req.file.path;
      const fileContent = fs.readFileSync(filePath);
      const extractedData = await processPassport(fileContent);

      const outputFilePath = path.join(
        'output',
        `${path.basename(filePath, path.extname(filePath))}.json`
      );

      if (!fs.existsSync('output')) {
        fs.mkdirSync('output');
      }

      fs.writeFileSync(outputFilePath, JSON.stringify(extractedData, null, 2), 'utf8');
      const filledPdfPath = await processPdf(
        'Xfa_i-129-unlocked.pdf',
        'output/filled_form.pdf',
        extractedData,
        fieldMapping
      );

      const mailOptions = {
        from: 'lawgical.immigration@gmail.com',
        to: email,
        subject: "📋 Action Required: Completed Visa Form is Ready for Review",
        text: "Exciting news! The first version of visa form is ready for your review. 📋",
        attachments: [{ filename: 'filled_I129_form.pdf', path: filledPdfPath }],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send(error.toString());
        }
        res.local.infoResponse = info.response;
        return next();
      });
    } catch (err) {
      res.status(500).send('Error processing file.');
    }
  },
};

module.exports = employeeController;
