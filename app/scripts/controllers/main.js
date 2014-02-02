'use strict';

angular.module('SocketStreamValidation')
    .factory('socket', function(socketFactory, $location, $window) {

        // TODO: Path name hack for socket.io . . . maybe figure something out better someday
        var path = $window.location.pathname;

        if (path.length === 1) {
            path = "";
        } else {
            path = $window.location.pathname.substring(1, $window.location.pathname.length);
        }

        return socketFactory({
            ioSocket: io.connect('/', {
                resource: path + 'socket.io'
            })
        });
    })
    .controller('MainCtrl', function($scope, socket) {
        $scope.validCheck = function() {
            socket.emit('validate', {
                value: $scope.checkValue
            });
        };

        socket.on('validator', function(data) {
            if (!data.value) {
                $scope.lookupError = "error";
            } else {
                $scope.lookupError = "";
            }

        })
    });
