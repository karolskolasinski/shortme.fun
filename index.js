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


// routes
app.get('/', async (req, res) => {
    const shortUrls = await databaseSchema.find();
    res.render('index', {
        shortUrls: shortUrls,
    });
});


app.post('/shortMe', async (req, res) => {
    await databaseSchema.create({
        full: req.body.fullUrl,
    });
    res.redirect('/');
});

app.get('/:shortReq', async (req, res) => {
    const foundShortUrl = await databaseSchema.findOne({
        short: req.params.shortReq,
    });

    if (!foundShortUrl) return res.sendStatus(404);

    foundShortUrl.clicks++;
    foundShortUrl.save();

    res.redirect(foundShortUrl.full);
});


// run
app.listen(process.env.PORT || 8080, () => {
    console.log('http://localhost:8080');
});
