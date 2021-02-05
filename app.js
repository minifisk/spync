const path = require('path');
const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const morgan = require('morgan'); 
const exphbs = require('express-handlebars')  
const passport = require('passport');
const session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);



// Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);


//express app
const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Handlebars
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Sessions

// Setting options for DB connected to sessions
var options = {
	host: 'spyncdb.chozhfmdzzyy.eu-central-1.rds.amazonaws.com',
	port: 3306,
	user: 'admin',
	password: 'jUFX823mUYwcAll5cGmg',
	database: 'spyncdb'
};

// Create new store object from sessions
var sessionStore = new MySQLStore(options);

// Set app to ues sessions with above settings
app.use(session({
	key: 'session_cookie_name',
	secret: 'session_cookie_secret',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

// Listen for requests
const port = process.env.port || 8888;
app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});


/* //404 page
app.use((req, res) => {
    res.status(404).render('404')
}) */



