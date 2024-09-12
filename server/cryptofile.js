const fs = require('fs')
const path = require('path')
const { supabasePublic, supabaseSecret } = require('../database/dbConfig')
const dotenv = require("dotenv");
dotenv.config();
const encryptionKey = process.env.ENCRYPTION_KEY

const encryptData = async (text) => {

  const { data, error } = await supabaseSecret.rpc('simple_encrypt', {
    input_text: text,
    input_key: encryptionKey
  });

  if (error) {
    console.error("Error encrypting data: ", error);
    return null;
  } else {
    return data;
  }
};


const decryptData = async (encryptedText) => {

  const { data, error } = await supabaseSecret.rpc('simple_decrypt', {
    encrypted_text: encryptedText,
    input_key: encryptionKey
  })
  if (error) {
    console.log("Error decrypting data: ", error);
  } 
  else {
    console.log("Successfully decrypted data: ", data);
    return data;
  }
}


module.exports = {
  encryptData,
  decryptData
}