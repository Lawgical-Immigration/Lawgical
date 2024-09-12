const { createClient } = require('@supabase/supabase-js')
const dotenv = require("dotenv");
dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY


const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);
const supabaseSecret = createClient(supabaseUrl, supabaseServiceKey);


module.exports = { supabasePublic, supabaseSecret };