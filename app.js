// dependencies
var express = require('express');
var io = require('socket.io');

var app = express.createServer();

/////////////////////////////////////////////////
// configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});
/////////////////////////////////////////////////

/////////////////////////////////////////////////
// routes
app.get('/', function(req,res) {
    res.render('login', {
        title: 'Welcome'
    });
});

app.get('/amazons', function(req,res) {
    res.render('amazons');
});
/////////////////////////////////////////////////

/////////////////////////////////////////////////
// socket setup
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
/////////////////////////////////////////////////

if (!module.parent) {
  app.listen(8080);
  console.log("Express server listening on port %d", app.address().port);
}
