const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const databaseModel = require('./models/shortUrl');
const favicon = require('serve-favicon');


// settings
app.set('view engine', 'pug');

const log = process.env.DB_CONFIG_LOGIN;
const pass = process.env.DB_CONFIG_PASSWORD;
const db = process.env.DB_CONFIG_DATABASE;
mongoose.connect(`mongodb+srv://${log}:${pass}@shortme-fun-database.qeghd.mongodb.net/${db}?retryWrites=true&w=majority`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).catch(error => {
    console.error('Probably wrong credentials provided.\n', error);
    process.exit(1);
});

app.use(express.urlencoded({ extended: false }));
app.use('*/css', express.static('public/css'));
app.use('*/img', express.static('public/img'));
app.use('*/js', express.static('public/js'));
app.use('*/font', express.static('public/font'));
app.use(favicon(__dirname + '/favicon.ico'));


const routingErrorHandler = (err, res, code, msg) => {
    console.error(msg, err);
    res.status(code);
    res.render('error', { error: msg });
};


// routes
app.get('/', async (req, res) => {
    try {
        const shortUrls = await databaseModel.find()
            .sort({ clicks: -1 })
            .limit(10);

        res.render('index', { shortUrls: shortUrls });
    } catch (err) {
        console.error('An attempt to find the first 10 shortened urls in the database has failed.\n', err);
        /*
        * Render the index page regardless of exceptions thrown due to database problems.
        * The index should be rendered without these records.
        * */
        res.render('index');
    }
});


app.post('/shortMe', async (req, res) => {
    let shortUrl;

    try {
        shortUrl = await databaseModel.findOne({ full: req.body.fullUrl });
    } catch (err) {
        return routingErrorHandler(err, res, 404, 'An attempt to find a short address in the database has failed.\n');
    }

    try {
        if (!shortUrl) {
            shortUrl = req.body.premium ?
                await databaseModel.create({ full: req.body.fullUrl, short: req.body.premium }) :
                await databaseModel.create({ full: req.body.fullUrl });
        }

        res.render('index', { full: shortUrl.full, short: shortUrl.short });
    } catch (err) {
        routingErrorHandler(err, res, 500, 'An attempt to create the resource to the database has failed.\n');
    }
});


app.get('/:shortReq', async (req, res) => {
    let shortUrl;

    try {
        shortUrl = await databaseModel.findOne({ short: req.params.shortReq });
    } catch (err) {
        return routingErrorHandler(err, res, 404, 'An attempt to find a short address in the database has failed.\n');
    }

    try {
        if (!shortUrl) {
            res.status(404);
            return res.render('error');
        }

        shortUrl.clicks++;
        await shortUrl.save();

        res.redirect(shortUrl.full);
    } catch (err) {
        routingErrorHandler(err, res, 500, 'An attempt to save the resource to the database has failed.\n');
    }
});


// run
app.listen(process.env.PORT || 8080, () => {
    console.log('http://localhost:8080');
});
