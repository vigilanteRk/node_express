const express = require('express');
const path = require('path'); // path where views need to be saved
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Connecting to database
mongoose.connect('mongodb://loaclhost/nodeexpress');
let db = mongoose.connection;

// Check connection
db.once('open', () => {
    console.log('Connected to Mongodb');
})

// Check db Errors
db.on('error', (err) => {
     console.log(err);
})

// Init App
const app = express();

// Brimg in models from model folder
let Article = require('./model/article');

// Load View Engine
app.set('views', path.join(__dirname, 'views')); // path where views need to be saved
app.set('view engine', 'pug');

// Body Parser Middleware 
// Parse application/X-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Home Route 00
app.get('/', (req, res) => {
    // here passing articles from function, from query, and passing to view
    // check for error
    Article.find({}, (err, articles) => {
        if(err){
            console.log(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles // view
            }); 
        }
    });
});    
    
    /* let articles = [
        {
            id: 1,
            title: 'Article One',
            aurthor: 'Rajumar Singh',
            body: 'This is Article one'
        },
        {
            id: 2,
            title: 'Article Two',
            aurthor: 'Rajumar',
            body: 'This is Article Two'
        },
        {
            id: 3,
            title: 'Article Three',
            aurthor: 'Rk',
            body: 'This is Article three'
        },
    ]; */

// Add Route 01
app.get('/articles/add', (req, res) => { // aepanda/padiya or artcles/add:name dosen't matter
    res.render('add_articles', {
        title: 'Add Articles'
    });
});

// Add Submit Post Route
app.post('/articles/add', (req, res) => {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save((err) => {
        if(err){
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });    
});

// Start Server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});