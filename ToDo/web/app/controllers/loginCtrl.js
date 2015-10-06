'use strict';

angular.module('waTODO').controller('LoginCtrl', Login);

Login.$inject = ['$scope' , '$window', '$wakanda'];

function Login($scope, $window, $wakanda) {


    $scope.login = function(user) {

        $wakanda.$loginByPassword(user.username, user.password).then(function(loginResult) {
            if (loginResult.result === true) {

                $window.location = 'index.html#/main';
            }
            else {
            	
                $('.alert-invalidLogin').show();
            }

        });

    }

}