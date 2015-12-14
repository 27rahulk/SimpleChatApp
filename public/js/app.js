var chatApp = angular.module('chatApp',[]);
chatApp.directive('scroll', function($timeout) {
	  return {
		    restrict: 'A',
		    link: function(scope, element, attr) {
		      scope.$watchCollection(attr.scroll, function(newVal) {
		        $timeout(function() {
		         element[0].scrollTop = element[0].scrollHeight;
		        });
		      });
		    }
		  }
		});

chatApp.controller('chatCtrl',function($scope,$http){
	$scope.logged = false;
	$scope.me = {};
	$scope.room = {};
	$scope.loginUser = function(){
		$scope.user.nick = "likeWind";
		$scope.user.firstName = 'Rahul';
		$scope.user.room = 'default';
		$scope.user.type = 'A';
		$scope.user.active = true;
		$scope.socket = io();
		$scope.socket.emit('login',$scope.user);
//		socket.socketBindAction('user',$scope.user);
		console.log('done');
		$scope.socketBindAction('message',$scope.onMessageReceive);
		$scope.socketBindAction('note',$scope.onNotificationReceive);
	};
	$scope.socketBindAction = function(activity,func){
		$scope.socket.on(activity,func);
	};
	
	$scope.onMessageReceive = function(msg){
		console.log(msg);
		$scope.room.messages.push(msg);
		$scope.$apply();
	};
	$scope.onNotificationReceive = function(actMsg){console.log(actMsg);};
	$scope.onRoomChange = function(room){
		console.log(room);
		$scope.room = room;
		$scope.room.messages = [];
		$scope.$apply();
	};
	$scope.onUserBound = function(user){
		console.log(user);
		$scope.me = user;
	};
	$scope.chatLogin = function(loginType){
		$scope.me.type = loginType;
		$scope.socket = io();
		$scope.socket.emit('login',$scope.me);
		$scope.logged=true;
		$scope.socketBindAction('message',$scope.onMessageReceive);
		$scope.socketBindAction('note',$scope.onNotificationReceive);
		$scope.socketBindAction('room',$scope.onRoomChange);
		$scope.socketBindAction('user',$scope.onUserBound);
	};
	$scope.sendMessageToRoom = function(){
		var msg = {};
		msg.roomId = $scope.room.roomId;
		msg.senderId = $scope.me.userId;
		msg.sender = $scope.me.nick;
		msg.message = $scope.myMessageToRoom;
		$scope.socket.emit('message',msg);
	};
});

