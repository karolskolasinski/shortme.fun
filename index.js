const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const databaseSchema = require('./models/shortUrl');


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
app.use('*/css', express.static('public/css'));
app.use('*/img', express.static('public/img'));
app.use('*/js', express.static('public/js'));

// routes
app.get('/', async (req, res) => {
    const shortUrls = await databaseSchema.find();
    res.render('index', {
        shortUrls: shortUrls,
    });
});


app.post('/shortMe', async (req, res) => {
    let shortUrl = await databaseSchema.findOne({
        full: req.body.fullUrl,
    });

    if (!shortUrl) {
        shortUrl = await databaseSchema.create({
            full: req.body.fullUrl,
        });
    }

    res.render('index', {
        short: shortUrl.short,
        full: shortUrl.full,
    });
});


app.get('/:shortReq', async (req, res) => {
    const foundShortUrl = await databaseSchema.findOne({
        short: req.params.shortReq,
    });

    if (!foundShortUrl) {
        res.status(404);
        return res.render('error');
    }

    foundShortUrl.clicks++;
    foundShortUrl.save();

    res.redirect(foundShortUrl.full);
});


// run
app.listen(process.env.PORT || 8080, () => {
    console.log('http://localhost:8080');
});
