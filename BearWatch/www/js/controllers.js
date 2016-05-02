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
    
	//open datbase example
	var db = window.sqlitePlugin.openDatabase({name: 'bw.db', location: 'default'});
	
	//Table creation - dropping old table for testing
	db.transaction(function(tx) {
		tx.executeSql("DROP TABLE IF EXISTS sessions;")
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
	
	//var for tracking current insert for selecting
	var insId;
	
	//insert example
	$scope.insert = function() {			
		db.transaction(function(tx) {
			tx.executeSql("INSERT INTO sessions (observers) VALUES (?)", [$scope.data], function(tx, res) {
				console.log("insertId: " + res.insertId);
				$scope.result = $scope.data + " inserted to BW Database";
				insId = res.insertId;				
			});
		}, function(e) {
			console.log("ERROR: " + e.message);                      
			$scope.result = "ERROR: " + e.message;
		});
	}
	
	//select example
    $scope.select = function() {
		db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM sessions WHERE session_id = (?)", [insId], function(tx, res) {
				if(res.rows.length > 0){
					$scope.result = res.rows.item(0).observers;
					console.log("observers " + res.rows.item(0).observers)
				}
			});
		}, function(e) {
			console.log("ERROR: " + e.message);
            $scope.result = "ERROR: " + e.message;
		});
    }      
})

.controller('focalTabCommentCtrl', function($scope) {

})

.controller('focalTabCameraCtrl', function($scope, $cordovaCamera) {
	$scope.takePhoto = function () {
                  var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
   
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $scope.imgURI = "data:image/jpeg;base64," + imageData;
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });
                }
                
                $scope.choosePhoto = function () {
                  var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
   
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $scope.imgURI = "data:image/jpeg;base64," + imageData;
                    }, function (err) {
                        // An error occured
						console.log("Camera error: " + err.message)
                    });
                }

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

.controller('reviewSaveCSV', function($scope) {

})

.controller('reviewSaveZIP', function($scope) {

})

.controller('reviewSendEmail', function($scope) {

})