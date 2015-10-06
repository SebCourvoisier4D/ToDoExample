'use strict';


angular.module('waTODO', ['ngRoute', 'wakanda']).config(function($routeProvider, $locationProvider) {

    $routeProvider.when('/login/:redirect?', {
        templateUrl: 'app/views/login.html',
        controller: 'LoginCtrl'
    }).when('/main', {
        templateUrl: 'app/views/main.html',
        controller: 'MainCtrl'
    }).when('/task/:id', {
        templateUrl: 'app/views/attachment.html',
        controller: 'AttachmentCtrl'
    }).otherwise({
        redirectTo: '/login'
    });

})

.run(function($route, $routeParams, $location, $rootScope, $timeout, $window,$wakanda) {


    

    $wakanda.$currentUser().then(function(res) {
    	
        
        
        var currUser = res.result;
        
        if (!currUser) {
 

                $window.location = 'index.html#/login';
            

        }

    });

})