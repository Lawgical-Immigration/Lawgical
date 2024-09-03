// import { createClient } from '@supabase/supabase-js'
const createClient = require('@supabase/supabase-js').createClient;
const dotenv = require("dotenv");
dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase;