const express = require('express');
const app = express();

app.set('view engine', 'pug');


app.get('/', (req, res) => {
    res.render('index');
});


app.listen(process.env.PORT || 8080, function () {
    console.log('http://localhost:8080')
})
