var IOT = angular.module('IOT', []);


IOT.controller('baseController', ['$scope', '$http', function($scope, $http){
  console.log('hello, world!');

  $scope.delete = function(){
    console.log('delete click received');



    
  };

}]);
