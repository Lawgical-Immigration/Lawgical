const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Employee = require('../models/employeeModel'); // Use the updated Employee model

require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  const newEmployee = {
    googleId: profile.id,
    displayName: profile.displayName,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    image: profile.photos[0].value,
    email: profile.emails[0].value,
  };

  try {
    let employee = await Employee.findOne({ googleId: profile.id });

    if (employee) {
      // If employee already exists, proceed
      done(null, employee);
    } else {
      // Check if the employee with the same email exists
      employee = await Employee.findOne({ email: profile.emails[0].value });

      if (employee) {
        // If an employee with the same email exists, update their Google details
        employee.googleId = profile.id;
        employee.displayName = profile.displayName;
        employee.image = profile.photos[0].value;
        await employee.save();
        done(null, employee);
      } else {
        // If no employee exists with that email, create a new employee entry
        employee = await Employee.create(newEmployee);
        done(null, employee);
      }
    }
  } catch (err) {
    console.error(err);
  }
}));

passport.serializeUser((employee, done) => {
  done(null, employee.id);
});

passport.deserializeUser((id, done) => {
  Employee.findById(id, (err, employee) => done(err, employee));
});
