const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const databaseModel = require('./models/shortUrl');


// settings
app.set('view engine', 'pug');

const log = process.env.DB_CONFIG_LOGIN;
const pass = process.env.DB_CONFIG_PASSWORD;
const db = process.env.DB_CONFIG_DATABASE;
mongoose.connect(`mongodb+srv://${log}:${pass}@shortme-fun-database.qeghd.mongodb.net/${db}?retryWrites=true&w=majority`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

app.use(express.urlencoded({ extended: false }));
app.use('*/css', express.static('public/css'));
app.use('*/img', express.static('public/img'));
app.use('*/js', express.static('public/js'));

// routes
app.get('/', async (req, res) => {
    try {
        const shortUrls = await databaseModel.find()
            .sort({ clicks: 1 })
            .limit(10);

        res.render('index', { shortUrls: shortUrls });
    } catch (err) {
        console.error('trying to find url in database failed', err);
        res.render('index');
    }
});


app.post('/shortMe', async (req, res) => {
    let code = 404;
    let error = 'short address not found in database';

    try {
        let shortUrl = await databaseModel.findOne({ full: req.body.fullUrl });

        if (!shortUrl) {
            shortUrl = req.body.premium ?
                await databaseModel.create({ full: req.body.fullUrl, short: req.body.premium }) :
                await databaseModel.create({ full: req.body.fullUrl });
            code = 500;
            error = 'unable to persist resource to database';
        }

        res.render('index', { full: shortUrl.full, short: shortUrl.short });
    } catch (err) {
        console.log(err);
        res.status(code);
        res.render('error', { error: error });
    }
});


app.get('/:shortReq', async (req, res) => {
    let code = 404;
    let error = 'short address not found in database';

    try {
        const foundShortUrl = await databaseModel.findOne({ short: req.params.shortReq });

        if (!foundShortUrl) {
            res.status(404);
            return res.render('error');
        }

        foundShortUrl.clicks++;
        foundShortUrl.save();

        res.redirect(foundShortUrl.full);
    } catch (err) {
        console.log(err);
        res.status(code);
        res.render('error', { error: error });
    }
});


// run
app.listen(process.env.PORT || 8080, () => {
    console.log('http://localhost:8080');
});
