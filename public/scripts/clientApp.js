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
      for (var i=0; i < $scope.analysis_results.length; i++){
        // console.log('i is : ', i, 'i.mxdlwk is: ', $scope.analysis_results[i].mxdlwk, ' and ', all_dates.includes(i.mxdlwk));
// all_dates.includes(i.mxdlwk)

        if (all_dates.includes($scope.analysis_results[i].mxdlwk)){
          // console.log('made it to the innermost');
            all_dates += i.mxdlwk;
        } else {
          console.log('made it to the outer most');
        }

      };
      console.log('all dates is: ', all_dates)


});

}]);
