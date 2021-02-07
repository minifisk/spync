const mysql2 = require('mysql2/promise');
require('dotenv').config();

// Connect to server (to be used for creating pool instances and queries)
const pool = mysql2.createPool({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    port     : process.env.DB_PORT,
    database : process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/* const connectDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host     : process.env.RDS_HOSTNAME,
            user     : process.env.RDS_USERNAME,
            password : process.env.RDS_PASSWORD,
            port     : process.env.RDS_PORT 
          });
        console.log('Connected to Spync database.');
    } catch (err) {
        console.log('Database connection failed: ' + err.stack);
        return;
    }
} */


// Connect to server (in environment for production mode) // NEED TO BE REDONE

/* const connectDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host     : process.env.RDS_HOSTNAME,
            user     : process.env.RDS_USERNAME,
            password : process.env.RDS_PASSWORD,
            port     : process.env.RDS_PORT 
          });
        console.log('Connected to Spync database.');
    } catch (err) {
        console.log('Database connection failed: ' + err.stack);
        return;
    }
} */

module.exports = pool;