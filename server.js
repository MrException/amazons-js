var app = require('express').createServer();

app.get('/', function(req,res) {
    res.render('index.html');
});


app.listen(8080);
