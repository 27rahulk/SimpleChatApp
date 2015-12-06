var chatApp = angular.module('chatApp',[]);
//var socket = io();
//console.log(socket);
//socket.on('connect',function(msg){
//	console.log(msg);
//	socket.emit('message','Hello I am someone you will never know');
//});
//socket.on('message',function(msg){
//	console.log(msg);
//});
//socket.on('notification',function(msg){
//	console.log(msg);
//});

chatApp.controller('chatCtrl',function($scope,$http){
	$scope.logged = false;
	$scope.user = {};
	$scope.loginUser = function(){
		$scope.user.nick = "likeWind";
		$scope.user.firstName = 'Rahul';
		$scope.user.room = 'default';
		$scope.user.type = 'A';
		$scope.user.active = true;
		$scope.socket = io();
		$scope.socket.emit('login',$scope.user);
//		socket.emit('login',$scope.user);
		console.log('done');
		$scope.socketBindAction('message',$scope.onMessageReceive);
		$scope.socketBindAction('notification',$scope.onNotificationReceive);
	};
	$scope.socketBindAction = function(activity,func){
		$scope.socket.on(activity,func);
	};
	
	$scope.onMessageReceive = function(msg){console.log(msg);};
	$scope.onNotificationReceive = function(actMsg){console.log(actMsg);};
	
	$scope.loginUser();
});

