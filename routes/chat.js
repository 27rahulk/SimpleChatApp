//user socket by user Id
var userSockets = {};
//room socket by room Id
var roomSockets = {};
//user by user id
var usersByUserId = {};
//room by room Id
var roomByRoomId = {};
var _ = require('underscore');
var Chance = require('chance').Chance();
//default room
var defaultRoom = {
		'roomId' : Chance.guid(),
		'owner' : 'system',
		'users' : []
};

roomByRoomId[defaultRoom.roomId] = defaultRoom;

var changeRoom = function(user,newRoomId){
	if(!_.isUndefined(user.roomId)){
		//removing user from previous room
		var room = roomByRoomId[user.roomId];
		room.users = _.reject(room.users,function(roomUser){
			return user.userId === roomUser.userId;
		});
	}
	var newRoom = roomByRoomId[newRoomId];
//	_.each(_.pluck(newRoom.users,'userId'),function(userId){
//		userSockets[userId].emit('newUser',user);
//	});
	newRoom.users.push(user);
	user.roomId = newRoomId;
};

var sendMessageToUser = function(message,userId){
	userSockets[userId].emit('message',message);
};

var sendMessageToRoom = function(message){
	var room = roomByRoomId[message.roomId];
	_.each(_.pluck(room.users,'userId'),function(userId){
		userSockets[userId].emit('message',message);
	});
};

var notifyUser = function(senderId,note,userId){
	userSockets[userId].emit('note',note);
};

var notifyRoom = function(userId,note,roomId){
	var room = roomByRoomId[roomId];
	_.each(_.pluck(room.users,'userId'),function(userId){
		userSockets[userId].emit('note',note);
	});
};

var loadRoom = function(userId,roomId){
	var room = roomByRoomId[roomId];
};

var createRoom = function(room,userId,userIds){
	room.roomId = Chance.guid();
	room.owner = userId;
	roomByRoomId[room.roomId] = room;
};

//when user connects
//assign userId > store socket > add user into default room > send notification to room for new user
var connectUser = function(socket,user){
	user.userId = Chance.guid();
	userSockets[user.userId] = socket;
	usersByUserId[user.userId] = user;	
	changeRoom(user, defaultRoom.roomId);
	socket.emit('user',user);
	socket.emit('room',defaultRoom);
	var note ={};
	note.note = user.nick+" Joined";
	note.type = 1;
	note.time = new Date().getTime();
	notifyRoom(user.userId,note,defaultRoom.roomId);
};

var disconnectUser = function(socket){
	var room = roomByRoomId[defaultRoom.roomId];
	var userId = _.findKey(userSockets, function(userSocket) {
//		console.log(userSocket);
		return userSocket === socket;
	});
	console.log(userId);
	room.users = _.reject(room.users,function(roomUser){
		return userId === roomUser.userId;
	});
	delete userSockets[userId];
};



module.exports = {
		connectUser : connectUser,
		disconnectUser : disconnectUser,
		changeRoom : changeRoom,
		sendMessageToUser : sendMessageToUser,
		sendMessageToRoom : sendMessageToRoom,
		notifyUser : notifyUser,
		notifyRoom : notifyRoom
};
