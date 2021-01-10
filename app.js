const { response } = require('express');
const express = require('express');
const mysql = require('mysql');


//express app
const app = express();

//Connect to mongoDB
const dbURI = 'mongodb+srv://netninja:test1234@cluster0.1ztr7.mongodb.net/<dbname>?retryWrites=true&w=majority'; 


//Register view engine
app.set('view engine', 'ejs');

// Listen for requests
const port = process.env.port || 3000;
app.listen(port, () => {
    console.log('listening to: ', port);
});

//Middleware and static files
app.use(express.static('public'));

app.get('/', (req, res) => {
    const blogs = [
        {title: 'Katt NAFSAR ägg', snippet: 'Katten tar sönder det'},
        {title: 'Katt tappar ägg', snippet: 'Katten tar sönder det'},
        {title: 'Katt mosar ägg', snippet: 'Katten tar sönder det'},
    ];

    res.render('index', { blogs });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'KATTOM' });
});

app.get('/blogs/create', (req, res) => {
    res.render('create');
})

//404 page
app.use((req, res) => {
    res.status(404).render('404')
})

var connection = mysql.createConnection({
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port     : process.env.RDS_PORT
  });
  
  connection.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
  
    console.log('Connected to database.');
  });
  
  connection.end();
