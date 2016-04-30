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
	
    $scope.result = "TEST INITIALIZED";
            
	var db = window.sqlitePlugin.openDatabase({name: 'bw.db', location: 'default'});

	db.transaction(function(tx) {
		tx.executeSql(
			"CREATE TABLE IF NOT EXISTS sessions ("
			+ "session_id       INTEGER PRIMARY KEY NOT NULL, "
			+ "protocol          TEXT    , "
			+ "collection_mode   TEXT    , "
			+ "park              TEXT    , "
			+ "water_body text   TEXT    , "
			+ "flow              TEXT    , "
			+ "start_time        TEXT    , "
			+ "finish_time       TEXT    , "
			+ "water_clarity     TEXT    , "
			+ "water_temp        TEXT    , "
			+ "observers         TEXT);"
		);
	});
	
	$scope.insert = function(name) {
            console.log("MAC INSERT HAPPENING");
		db.transaction(function(tx) {
			tx.executeSql("INSERT INTO sessions (observers) VALUES (?)", [name], function(tx, res) {
				console.log("BW insert happening");
                          $scope.result = "MAC INSERT HAPPENING: ";
                          for (var key in tx){
                            $scope.result += key + " : " + tx[key];
                          }
				console.log("insertId: " + res.insertId + " -- probably 1");
				console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");				
			});
		}, function(e) {
			console.log("ERROR: " + e.message);
                       $scope.result = "ERROR " + e.message;
		});
	}
	
    $scope.select = function(name) {
            console.log("MAC SELECT HAPPENING");
		db.transaction(function(tx) {
			tx.executeSql("select observers from sessions;", [], function(tx, res) {
				console.log("BW select happening");
                          $scope.result = "MAC SELECT HAPPENING ";
                          for (var key in res){
                          $scope.result += key + " : " + res[key];
                          }
				console.log("res.rows.length: " + res.rows.length + " -- should be 1");
                          $scope.result += " Result: " + res.rows.item(1).session_id;
			});
		}, function(e) {
			console.log("ERROR: " + e.message);
                       $scope.result = "ERROR: " + e.message;
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

.controller('scanningEnvironmentCtrl', function($scope) {

})


.controller('scanningCommentCtrl', function($scope) {

})

.controller('scanningCameraCtrl', function($scope) {

})

.controller('reviewListCtrl', function($scope) {

})