const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const supabase = require('../db/supabase');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const newEmployee = {
        google_id: profile.id,
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        profile_picture_url: profile.photos[0].value,
        email: profile.emails[0].value,
      };

      try {
        // Check if employee exists by google_id
        let { data: employee, error } = await supabase
          .from('employees')
          .select('*')
          .eq('google_id', profile.id)
          .single();

        if (employee) {
          // If employee exists, proceed
          done(null, employee);
        } else {
          // Check if an employee with the same email exists
          let { data: existingEmployee, error } = await supabase
            .from('employees')
            .select('*')
            .eq('email', profile.emails[0].value)
            .single();

          if (existingEmployee) {
            // Update the existing employee with Google details
            let { data: updatedEmployee, error } = await supabase
              .from('employees')
              .update({
                google_id: profile.id,
                profile_picture_url: profile.photos[0].value,
              })
              .eq('email', profile.emails[0].value)
              .select('*')
              .single();

            if (error) throw error;

            done(null, updatedEmployee);
          } else {
            // Insert a new employee into the database
            let { data: newEntry, error } = await supabase
              .from('employees')
              .insert([newEmployee])
              .select('*')
              .single();

            if (error) throw error;

            done(null, newEntry);
          }
        }
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((employee, done) => {
  done(null, employee.employee_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let { data: employee, error } = await supabase
      .from('employees')
      .select('*')
      .eq('employee_id', id)
      .single();

    if (error) throw error;

    done(null, employee);
  } catch (err) {
    console.error(err);
    done(err, null);
  }
});