'use strict';


angular.module('waTODO').controller('AttachmentCtrl', Attachment).filter('offset', function() {
    return function(input, start) {
        start = parseInt(start, 10);
        return input.slice(start);
    };
});

Attachment.$inject = ['$scope', '$routeParams', '$window', '$wakanda', '$filter'];

function Attachment($scope, $routeParams, $window, $wakanda, $filter) {

    $scope.attachs = [];

    $scope.itemsPerPage = 7;

    $scope.currentPage = 0;

    $wakanda.init().then(function(ds) {



        $scope.task = ds.Task.$findOne(parseInt($routeParams.id), {

            select: 'attachments'

        }).$promise.then(function(res) {

            $scope.task = res.result;

            $scope.task.attachments.$fetch().then(function(r) {

                $scope.attachs = r;
            });
        });


    });

    $scope.back = function() {

        $window.location = 'index.html#/main';
    };

    $scope.logout = function() {

        $wakanda.$logout().then(function(res) {


            $window.location = 'index.html#/login';

        });

    };


    $scope.removeOnClick = function(attach) {

        attach.$remove();

        $scope.task = $wakanda.$ds.Task.$findOne(parseInt($routeParams.id), {
            select: 'attachments'
        }).$promise.then(function(res) {

            $scope.task = res.result;

            $scope.task.attachments.$fetch().then(function(r) {
                $scope.attachs = r;
            });
        });


    };

    $scope.prevPage = function() {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.pageCount()) {
            $scope.currentPage++;
        }
    };

    $scope.pageCount = function() {
        var length = Math.ceil($scope.attachs.length / $scope.itemsPerPage) - 1;

        return length === -1 ? 0 : length;
    };

    $scope.prevPageDisabled = function() {
        return $scope.currentPage === 0 ? "disabled" : "btn-outline";
    };

    $scope.nextPageDisabled = function() {
        return $scope.currentPage === $scope.pageCount() ? "disabled" : "btn-outline";
    };



    Attachment.prototype.$scope = $scope;
    Attachment.prototype.$wakanda = $wakanda;
    Attachment.prototype.$routeParams = $routeParams;
}


Attachment.prototype.setFile = function(element) {

    var $scope = this.$scope;

    var $wakanda = this.$wakanda;

    var $routeParams = this.$routeParams;

    $scope.$apply(function() {

        $scope.fileToUpload = element.files[0];
        $scope.newUpload = $wakanda.$ds.Attachment.$create();

        $scope.newUpload.name = $scope.fileToUpload.name;

        $scope.newUpload.task = $scope.task;


        $scope.newUpload.file.$upload($scope.fileToUpload).then(function(e) {
            $scope.newUpload.$save();

            $scope.task = $wakanda.$ds.Task.$findOne(parseInt($routeParams.id), {

                select: 'attachments'

            }).$promise.then(function(res) {

                $scope.task = res.result;

                $scope.task.attachments.$fetch().then(function(r) {

                    $scope.attachs = r;
                });
            });


        });
    });
};