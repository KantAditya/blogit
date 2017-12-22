var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope){
    $scope.message = "Welcome Back";
    $scope.fname = "Aditya";
    $scope.lname = "Kant";
    $scope.name = "$scope.fname+$scope.lname";
})