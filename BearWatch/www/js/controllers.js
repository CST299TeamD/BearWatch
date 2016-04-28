angular.module('app.controllers', [])
  
.controller('homeCtrl', function($scope) {

})

.controller('startNewSessionCtrl', function($scope) {

})

.controller('startNewSessionContCtrl', function($scope) {

})

.controller('observationModeCtrl', function($scope) {

})

.controller('focalCtrl', function($scope) {

})

.controller('addNewBearCtrl', function($scope) {

})

.controller('focalHumanCtrl', function($scope) {

})

.controller('focalEnvironmentCtrl', function($scope) {

})

.controller( 'dbTest', function ($scope, $cordovaSQLite){
	$scope.result = "no result";
	
    $scope.insert = function(name) {
        var query = "INSERT INTO sessions (observers) VALUES (?)";
        $cordovaSQLite.execute(db, query, [name]).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
			$scope.result = "inserted";
        }, function (err) {
            console.error(err);
			$scope.result = "insert failed";
        });
    }
 
    $scope.select = function(name) {
        var query = "SELECT observers FROM sessions WHERE observers = ?";
        $cordovaSQLite.execute(db, query, [name]).then(function(res) {
            if(res.rows.length > 0) {
                console.log("SELECTED -> " + res.rows.item(0).observers);
				$scope.result =  res.rows.item(0).observers;
            } else {
                console.log("No results found");
				$scope.result =  "No results found";
            }
        }, function (err) {
            console.error(err);
			$scope.result = "select failed";
        });
    }
            
})

.controller('focalTabCommentCtrl', function($scope) {

})

.controller('focalTabCameraCtrl', function($scope) {

})

.controller('scanningBearCtrl', function($scope) {

})


.controller('scanningHumanCtrl', function($scope) {

})