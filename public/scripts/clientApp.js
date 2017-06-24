var IOT = angular.module('IOT', []);


IOT.controller('baseController', ['$scope', '$http', function($scope, $http){
  console.log('hello, world!');

}]);


IOT.controller('results', ['$scope', '$http', function($scope, $http){
  console.log("This is the end");
var all_dates = [];

  $http({
       method: 'get',
       url: '/API',
      //  data: sendMe
     }).then(function(response){
       console.log(response.data);
       $scope.analysis_results = response.data;
       console.log("TOTAL LENGTH IS: ", $scope.analysis_results.length);
      for (i=1; i <= $scope.analysis_results.length; i++){

        
      }


     });

}]);
