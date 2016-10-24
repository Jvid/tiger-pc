var app = angular.module('myApp',[]);
app.controller('searchCtrl',['$scope','$http',function($scope,$http){
    $scope.search = null;
    $scope.flag = true;
    $scope.find = function(){
        console.log($scope.search);
        $scope.flag = false;
        //$scope.houseData = ['first','second','third'];


        $http.post('data/index.json').success(function(data){
            console.log(data)
            $scope.houseData = data;
        })

       //$http.post("../api/todo", $scope.search)
       //     .success(function(){
       //         console.info("Saved.");
       //     })
       //     .error(function(){
       //         console.error("Failed to save.");
       //     });
    }
}])