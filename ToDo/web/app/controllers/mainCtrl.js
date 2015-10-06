  'use strict';

  angular.module('waTODO').controller('MainCtrl', Main)
      .filter('offset', function() {
          return function(input, start) {
              start = parseInt(start, 10);
              return input.slice(start);
          };
      })
      .directive('tooltip', function() {
          return {
              restrict: 'A',
              link: function(scope, element, attrs) {

                  $(element)
                      .attr('title', attrs.tooltip)
                      .tooltip({
                          placement: "top"
                      });
              }
          }
      });

  Main.$inject = ['$scope', '$rootScope', '$window', '$wakanda', '$filter'];

  function Main($scope, $rootScope, $window, $wakanda, $filter) {



      $scope.itemsPerPage = 7;

      $scope.currentPage = 0;

      $scope.tasks = [];

      $scope.type = (typeof($rootScope.type) != "undefined") ? $rootScope.type : "todo";

      $wakanda.init().then(function(ds) {


          $wakanda.$ds.Task.$find({

              select: 'attachments'

          }).$promise.then(function(res) {
              $scope.tasks = res.result;
          });

      });



      $scope.$watch("type", function(newValue) {

          $scope.currentPage = 0;

          $rootScope.type = newValue;
      });



      $scope.logout = function() {

          $wakanda.$logout().then(function(res) {


              $window.location = 'index.html#/login';

          });

      };



      $scope.addOnClick = function(newTask) {

          $scope.type = "todo";

          var newEntity = $wakanda.$ds.Task.$create(newTask);
          newEntity.$save().then(function(e) {

              $wakanda.$ds.Task.$find({

                  select: 'attachments'

              }).$promise.then(function(res) {
                  $scope.tasks = res.result;
              });
              $scope.newTask.name = "";
          });

      };


      $scope.getTasksByType = function(task) {

          switch ($scope.type) {

              case 'deleted':
                  return task.deleted;
              case 'all':
                  return true;
              case 'done':
                  return task.completed && !task.deleted;
              case 'todo':
                  return !task.completed && !task.deleted;

          }

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
          var length = Math.ceil($filter('filter')($filter('filter')($scope.tasks, $scope.filterTask), $scope.getTasksByType).length / $scope.itemsPerPage) - 1;

          return length === -1 ? 0 : length;
      };

      $scope.prevPageDisabled = function() {
          return $scope.currentPage === 0 ? "disabled" : "btn-outline";
      };

      $scope.nextPageDisabled = function() {
          return $scope.currentPage === $scope.pageCount() ? "disabled" : "btn-outline";
      };


      $scope.editTask = function(task) {

          $scope.editedTask = task;
      };

      $scope.doneEditing = function(task, newname) {

          task.name = newname;
          task.$save().then(function(e) {
              //$scope.tasks = $wakanda.$ds.Task.$find();
              $scope.editedTask = null;
          });
      };

      $scope.navigateTo = function(task) {

          $window.location = 'index.html#/task/' + task.ID;
      };


      $scope.taskFontClass = function(task) {


          return (task.deleted) ? "deleted-font" : (task.completed ? "done-font" : "todo-font");


      };

  };