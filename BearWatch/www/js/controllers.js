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
	
	window.sqlitePlugin.deleteDatabase({name: 'my.db', location: 'default'});
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
		db.transaction(function(tx) {
			tx.executeSql("INSERT INTO sessions (observers) VALUES (?)", [name], function(tx, res) {
				console.log("BW insert happening");
				console.log("insertId: " + res.insertId + " -- probably 1");
				console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");				
			});
		}, function(e) {
			console.log("ERROR: " + e.message);
		});
	}
	
    $scope.select = function(name) {
		db.transaction(function(tx) {
			tx.executeSql("select count(observers) as cnt from sessions;", [], function(tx, res) {
				console.log("BW select happening");
				console.log("res.rows.length: " + res.rows.length + " -- should be 1");
				console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
			});
		}, function(e) {
			console.log("ERROR: " + e.message);
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