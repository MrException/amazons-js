var app = require('express').createServer();

app.get('/', function(req,res) {
    res.render('index.html');
});

app.use(express.staticProvider(__dirname + '/public'));

app.listen(8080);
