
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , chat = require('./routes/chat')
  , http = require('http')
  , path = require('path')
  , logger = require('./logs/log');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server =  http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



var io = require('socket.io').listen(server);
var users = [];
io.on('connection', function(socket){
//	console.log(socket);
	logger.info(socket.handshake);
	console.log('a user connected');
	socket.on('message',function(msg){
		console.log(msg);
		chat.sendMessageToRoom(msg);
//		socket.emit('message',msg);
	});
	socket.on('login',function(user){
		console.log(user);
		chat.connectUser(socket,user);
//		users.push(user);
//		socket.broadcast.emit('notification',user.nick+' has joined and total user now is '+users.length);
	});
	socket.on('disconnect',function(){
		console.log('disconnecting user');
		chat.disconnectUser(socket);
//		socket.emit('message',msg);
	});
	
});

