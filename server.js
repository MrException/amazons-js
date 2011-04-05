var express = require('express');
var io = require('socket.io');

var app = express.createServer();

app.get('/', function(req,res) {
    console.log('access');
    res.render('index.html');
});

app.use(express.static(__dirname + '/public'));

app.listen(8080);

var socket = io.listen(app);
socket.on('connection', function(client) {
    client.send("testing");
    client.on('message', function(message) {
        console.log(message);
    });

    client.on('disconnect', function() {
        console.log('disconnected');
    });
});
