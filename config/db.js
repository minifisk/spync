const mysql2 = require('mysql2/promise');

// Connect to server (to be used for creating pool instances and queries)
const pool = mysql2.createPool({
    host     : "spyncdb.chozhfmdzzyy.eu-central-1.rds.amazonaws.com",
    user     : "admin",
    password : "jUFX823mUYwcAll5cGmg",
    port     : "3306",
    database : "spyncdb",
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