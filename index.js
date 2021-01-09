express = require('express');
app = express();
const mysql = require('mysql');

const con = mysql.createConnection({
    host: "spync-database-instance-1.csydz3ayt58b.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "HaejHaejHunt"
});

app.post('/users', (req, res) => {
    if (req.query.username && req.query.email && req.query.age) {
        console.log('Request received');
        con.connect(function(err) {
            con.query(`INSERT INTO main.users (username, email, age) VALUES ('${req.query.username}', '${req.query.email}', '${req.query.age}')`, function(err, result, fields) {
                if (err) res.send(err);
                if (result) res.send({username: req.query.username, email: req.query.email, age: req.query.age});
                if (fields) console.log(fields);
            });
        });
    } else {
        console.log('Missing a parameter');
    }
});

app.get('/users', (req, res) => {
    con.connect(function(err) {
        con.query(`SELECT * FROM main.users`, function(err, result, fields) {
            if (err) res.send(err);
            if (result) res.send(result);
        });
    });
});

const port = process.env.port || 3000;
app.listen(port, () => {
    console.log('listening to: ', port);
});