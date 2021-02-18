const path = require('path');
const express = require('express');
const morgan = require('morgan'); 
const exphbs = require('express-handlebars')  
const passport = require('passport');
const session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var favicon = require('serve-favicon')

// Dotenv for config files
require('dotenv-flow').config();

// Passport config
require('./config/passport')(passport);

//express app
const app = express();

// Serving the favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    port     : process.env.DB_PORT,
    database : process.env.DB_NAME,
};

// Create new store object from sessions
var sessionStore = new MySQLStore(options);

// Set app to ues sessions with above settings
app.use(session({
	key: 'session_cookie_name',
	secret: process.env.SESSION_SECRET,
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
app.use('/friends', require('./routes/friends'));


// Listen for requests
const port = process.env.port || 8888;
app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});


/* //404 page
app.use((req, res) => {
    res.status(404).render('404')
}) */



