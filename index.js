const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();


// settings
app.set('view engine', 'pug');
const log = process.env.DB_CONFIG_LOGIN;
const pass = process.env.DB_CONFIG_PASSWORD;
const db = process.env.DB_CONFIG_DATABASE;
mongoose.connect(`mongodb+srv://${log}:${pass}@shortme-fun-database.qeghd.mongodb.net/${db}?retryWrites=true&w=majority`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});


// routes
app.get('/', (req, res) => {
    res.render('index');
});


app.post('/shortMe', (req, res) => {

});


// run
app.listen(process.env.PORT || 8080, () => {
    console.log('http://localhost:8080');
});
