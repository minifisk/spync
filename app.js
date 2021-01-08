const { response } = require('express');
const express = require('express');
const morgan = require('morgan');

//express app
const app = express();

//Connect to mongoDB
const dbURI = 'mongodb+srv://netninja:test1234@cluster0.1ztr7.mongodb.net/<dbname>?retryWrites=true&w=majority'; 


//Register view engine
app.set('view engine', 'ejs');

// Listen for requests
app.listen(3000, () => {
    console.log('listening to 3000...')
});

//Middleware and static files
app.use(express.static('public'));

app.get('/', (req, res) => {
    const blogs = [
        {title: 'Katt hittar ägg', snippet: 'Katten tar sönder det'},
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

