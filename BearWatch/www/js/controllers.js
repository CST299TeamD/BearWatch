angular.module('app.controllers', [])
  
.controller('homeCtrl', function($scope) {

})

.controller('startNewSessionCtrl', function($scope) {
            
            //function to add text box for "other" selections
            $scope.showNSTextBox = function(selectModel, value){
                if(selectModel == "viewingArea" && value == "Other"){
                    $scope.viewingAreaOther = '<label style="" class="item item-input"><span class="input-label">Description:</span><input placeholder="" type="text"></label>';
                } else {
                    $scope.viewingAreaOther = '';
                }
            }
            
            //function to change zoning schema picture
            $scope.showZoneSchema = function(zoningSchemaSelect){
                if(zoningSchemaSelect == "River"){
                    $scope.zoningSchemaPic = '<br/> <h3>River Zone Map</h3> <br/> <img src="img/river.png"> <br/><br/>';
                } else if(zoningSchemaSelect == "Estuary"){
                    $scope.zoningSchemaPic = '<br/> <h3>Esturary Zone Map</h3> <br/> <img src="img/estuary.png"> <br/><br/>';
                } else if(zoningSchemaSelect == "Terrestrial"){
                    $scope.zoningSchemaPic = '<br/> <h3>Terrestrial Zone Map</h3> <br/> <img src="img/terrestrial.png"> <br/><br/>';
                } else {
                    $scope.zoningSchemaPic = '';
                }
            }

})

.controller('startNewSessionContCtrl', function($scope) {
            
            //function to add text box for "other" selections
            $scope.showNSCTextBox = function(selectModel, value){
                if(selectModel == "obscuredSelect" && value == "Other"){
                    $scope.obscuredOther= '<label style="" class="item item-input"><span class="input-label">Description:</span><input placeholder="" type="text"></label>';
                } else {
                    $scope.obscuredOther = '';
                }
            }
            
            //function to show obscured reason select box if visibility is obscured
            $scope.showObscuredSelect = function(visibilitySelect){
                if(visibilitySelect == 'Partly obscured' || visibilitySelect == 'Mostly obscured'){
                    $scope.obscured = true;
                } else {
                    $scope.obscured = false;
                }
            }
            
            

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
    var internet = "not set";
	if(window.Connection){
		internet = navigator.connection.type;
	}else {
		internet = "It doesn't work";
	}

	$scope.internet = internet;

})

.controller('focalTabCommentCtrl', function($scope) {

})

.controller('focalTabCameraCtrl', function($scope, $cordovaCamera, $cordovaFile) {
	$scope.camResult = "Photo page initialized";
            
	//function for taking picture using device camera
	$scope.takePhoto = function () {
		$scope.cameraResult = "taking photo";
		
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
			$scope.cameraResult ="taking photo pt.2";
			$scope.imgURI = "data:image/jpeg;base64," + imageData;
			$scope.imageInfo = imageData;
		}, function (err) {
			// An error occured
			$scope.cameraResult = "Camera error: " + err;
		});
	}
	
	//save photo to session
	$scope.choosePhoto = function () {
		
		$scope.fileName = "Not Saved"
		var sourcePath = $scope.imgURI;
		var sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
		var sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);

		console.log("Copying from : " + sourceDirectory + sourceFileName);
		console.log("Copying to : " + cordova.file.dataDirectory + sourceFileName);
		
		$cordovaFile.copyFile(sourceDirectory, sourceFileName, cordova.file.dataDirectory, sourceFileName).then(function(success) {
			$scope.fileName = cordova.file.dataDirectory + sourceFileName;
			console.log("fileName: " + cordova.file.dataDirectory + sourceFileName);
		}, function(error) {
			console.log(error.message);
		});

	}
	
	//discard photo
	$scope.discardPhoto = function () {
		$scope.imgURI;
		$scope.cameraResult = "Clearing photo - reloading screen";
		$state.go($state.current, {}, {reload: true});
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

.controller('bearInfoCtrl', function($scope) {
            var bear ={
                       name:"Bear 1",
                       location: "Zone5",
                       species: "Black",
                       habituationLevel: "Habituated",
                       gender: "Male",
                       age: "Adult",
                       markDesc: "Unknown",
                       furColour:"pink"
            };
            $scope.bear = bear;
})

.controller('bearSpecCtrl', function($scope) {
            
            
})