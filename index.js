const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const ShortUrl = require('./models/ShortUrl');


// settings
app.set('view engine', 'pug');

const log = process.env.DB_CONFIG_LOGIN;
const pass = process.env.DB_CONFIG_PASSWORD;
const db = process.env.DB_CONFIG_DATABASE;
mongoose.connect(`mongodb+srv://${log}:${pass}@shortme-fun-database.qeghd.mongodb.net/${db}?retryWrites=true&w=majority`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

app.use(express.urlencoded({extended: false}));


// routes
app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', {
        shortUrls: shortUrls,
    });
});


app.post('/shortMe', async (req, res) => {
    await ShortUrl.create({full: req.body.fullUrl});
    res.redirect('/');
});


// run
app.listen(process.env.PORT || 8080, () => {
    console.log('http://localhost:8080');
});
