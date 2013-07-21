'use strict';

angular.module('SocketStreamValidation')
  .controller('MainCtrl', function ($scope, socket) {
    $scope.validCheck = function(){
    	socket.emit('validate', { value: $scope.checkValue});
    };

    socket.on('validator', function(data){
    	if( !data.value){
    		$scope.lookupError = "error";
    	} else {
    		$scope.lookupError = "";
    	}
    	
    })
  });
