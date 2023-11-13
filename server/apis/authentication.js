const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  
const httpStatusCodes = require('../HttpStatusCode')

const login = async (email, password, res) => {
    try {
        // Retrieve user information based on the provided email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        // Check if the user exists
        if (result.rows.length === 0) {
            return res({ "statusCode": httpStatusCodes.OK, data: { status: false, message: "User not found" } });
        }

        const user = result.rows[0];

        // Verify the entered password using bcrypt
        const hashed = await hashPassword(password, user.password_salt)
        const isPasswordValid = bcrypt.compare(hashed, user.password_hash);

        if (isPasswordValid) {
            // Password is valid, you can return the user data or a success message
            const token = generateToken(user.id, user.email);
            return res({ "statusCode": httpStatusCodes.OK, data: { status: true, message: "Login successful", token: token } });
        } else {
            // Password is invalid
            return res({ "statusCode": httpStatusCodes.OK, data: { status: false, message: "Invalid password" } });
        }
    } catch (error) {
        console.error('Error executing query', error);
        return res({ "statusCode": httpStatusCodes.OK, data: { status: false, message: "Internal Server Error" } });
    }
}


// Function to generate a random salt
const generateSalt = async () => {
    const saltRounds = 10; // Adjust the number of rounds based on your security requirements
    return bcrypt.genSalt(saltRounds);
};

// Function to hash a password using a provided salt
const hashPassword = async (password, salt) => {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

// Function to generate JWT token
const generateToken = (userId, email) => {
    const payload = { userId, email };

    const secretKey = process.env.JWT_KEY;

    const expiresIn = '1h';

    const token = jwt.sign(payload, secretKey, { expiresIn });

    return token;
};

// Function to verify JWT token
const verifyToken = async (token) => {
    try {
        if (token) {
            const result = await pool.query('SELECT * FROM revoked_tokens WHERE token_id = $1', [token]);
            if (result.rows.length > 0) {
                return ""
            }
        }
        const secretKey = process.env.JWT_KEY;
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        console.error('Error verifying token', error);
        throw error;
    }
};

const insertUser = async (email, password, res) => {
    try {
        // Generate a random salt
        const salt = await generateSalt();

        // Combine the plain text password with the salt and hash it
        const hashedPassword = await hashPassword(password, salt);

        // Insert the user into the 'users' table
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, password_salt) VALUES ($1, $2, $3)',
            [email, hashedPassword, salt]
        );

        return res({ "statusCode": httpStatusCodes.OK, data: { status: true, message: "Login successful" } });
    } catch (error) {
        console.error('Error inserting user', error);
        return res({ "statusCode": httpStatusCodes.INTERNAL_SERVER, data: { status: false, message: error } });
    }
};

const logout = async (token, res) => {
    try {
        if(token) {
            const result = await pool.query('INSERT INTO revoked_tokens (token_id) VALUES ($1)', [token]);
            return res({ "statusCode": httpStatusCodes.OK, data: { status: true, message: "logout successful" } });
     
        } else {
            return res({ "statusCode": httpStatusCodes.BAD_REQUEST, data: { message: 'Invalid gender' } });
        }
       
    } catch (error) {
        console.error('Error log out user', error);
        return res({ "statusCode": httpStatusCodes.INTERNAL_SERVER, data: { status: false, message: error } });
    }

}

module.exports = {
    login, insertUser, verifyToken, logout
}