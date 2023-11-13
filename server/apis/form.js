const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  
const httpStatusCodes = require('../HttpStatusCode')

const submitDetail = async (name, email, phone, country, gender, qualification, res) => {
    try {
        // Check if required fields are not empty
        if (!name || !email || !phone || !country || !gender) {
            return res({ "statusCode": httpStatusCodes.OK, data: { status: false, message: 'Required fields cannot be empty' } });
        }
    
        // Check if gender is valid
        const validGenders = ['male', 'female', 'binary'];
        if (!validGenders.includes(gender)) {
            return res({ "statusCode": httpStatusCodes.OK, data: { status: false, message: 'Invalid gender' } });
        }
    
        // Check if phone contains only digits
        if (!/^\d+$/.test(phone)) {
            return res({ "statusCode": httpStatusCodes.OK, data: { status: false, message: 'Invalid phone number' } });
        }
    
        // Insert data into the user_details table
        const result = await pool.query(
          'INSERT INTO user_details (name, email, phone, country, gender, qualification) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [name, email, phone, country, gender, qualification]
        );
        return res({ "statusCode": httpStatusCodes.OK, data: { status: true, message: 'User details inserted successfully' } });
      } catch (error) {
        console.error('Error inserting user details', error);
        return res({ "statusCode": httpStatusCodes.INTERNAL_SERVER, data: { status: false, message: 'Internal Server Error' } });
      }
}

module.exports = {
    submitDetail
}