var express = require('express');
var io = require('socket.io');

var app = express.createServer();
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');

app.get('/', function(req,res) {
    res.render('index');
});

app.get('/amazons', function(req,res) {
    res.render('amazons');
});


app.listen(8080);

var socket = io.listen(app);
socket.on('connection', function(client) {
    client.send('testing');
    console.log('The client session id is: ' + client.sessionId);
    client.on('message', function(message) {
        console.log(message);
    });

    client.on('disconnect', function() {
        console.log('disconnected');
    });
});
