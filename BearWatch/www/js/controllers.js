angular.module('app.controllers', [])
  
.controller('homeCtrl', function($scope) {

})

.controller('startNewSessionCtrl', function($scope, $cordovaSQLite) {
	$scope.debug = debug;
            
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

.controller('dashCtrl', function($scope, $ionicPopup, $state, $location) {

            $scope.showConfirm = function() {
            var confirmPopup = $ionicPopup.confirm({
                                                   title: 'End Session',
                                                   template: 'Once a session is closed it cannot be re-opened. Continue closing session?'
                                                   });
            confirmPopup.then(function(res) {
                              if(res) {
                              console.log('Sure!');
                              $location.path("/ReviewList");
                              } else {
                              console.log('Not sure!');
                              }
                              });
            }
})

.controller('addNewBearCtrl', function($scope) {

})

.controller('focalHumanCtrl', function($scope) {
	//test data for zone matrix - to do: dynamically attribute from zone selection
	//estuary hard-coded
	$scope.zones = ["+1", "1", "4", "7", "7+", "2+", "2", "5", "8", "8+", "6"];
	
	//esturary zone image - hard coded, needs to be dynamically
	$scope.zoneImgURI = "img/estuary.png"

})

.controller('focalEnvironmentCtrl', function($scope) {
            
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

.controller( 'dbTest', function ($scope, $cordovaSQLite){
	
    $scope.result = "TEST INITIALIZED";

	$scope.insert = function() {			
		$cordovaSQLite.execute(db, 'INSERT INTO sessions (observers) VALUES (?)', [$scope.data])
        .then(function(result) {
            $scope.result = "Message saved successful, cheers!";
        }, function(error) {
            $scope.result = "Error on saving: " + error.message;
        })
	}
	
	//select example
    $scope.select = function() {
		// Execute SELECT statement to load message from database.
        $cordovaSQLite.execute(db, 'SELECT * FROM sessions ORDER BY session_id DESC')
            .then(
                function(result) {

                    if (result.rows.length > 0) {

                        $scope.status = result.rows.item(0).observers;
                        $scope.result = "Message loaded successful, cheers!";
                    }
                },
                function(error) {
                    $scope.result = "Error on loading: " + error.message;
                }
            );
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

//Controller loaded when "Review Sessions" is selected"
.controller('reviewListCtrl', function($scope, $cordovaEmailComposer) {
	
	console.log('starting reviewListCtrl');
	document.addEventListener("deviceready", onDeviceReady, false);

	function onDeviceReady() {
		console.log('dataDirectory: '+cordova.file.dataDirectory);
		
	}	
	
	//Test function to save a file locally
	$scope.reviewSaveSendCSV = function () {
		console.log('starting reviewSaveCSV');
		
		copyToPublic("bear1.jpg");
		
		//copyToPublic takes a string name of a file and looks for it in the dataDirectory, then runs sendFileEntryToPublic on it
		function copyToPublic(fileName){
			var filePath = cordova.file.dataDirectory + "files/" + fileName;
			window.resolveLocalFileSystemURL(filePath, sendFileEntryToPublic, fail);
		}

		//sendFileEntryToPublic takes a file and moves it to a public directory
		function sendFileEntryToPublic(fileEntry) {
			console.log("gotFileEntry: "+fileEntry.name);
			console.log("fileEntry fullpath: "+fileEntry.fullPath);			
			console.log("copying to..." + cordova.file.dataDirectory);		
			console.log("copying to..." + cordova.file.externalDataDirectory);
			
			//cordova.file.externalDataDirectory >> cordova.file.documentsDirectory
			window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,
				function onSuccess(dirEntry)
				{
					fileEntry.copyTo(
						dirEntry, //directory to
						fileEntry.name, //fileEntry.name keeps the file's name the same, we can change it though
						function() {
							alert('copying was successful');
							//chmodRWRWR(fileEntry.name);
							mailSingle(fileEntry.name);
						},
						function() {alert('unsuccessful copying')}
					);
				}, 
				fail);

		}
		function fail(evt) {
			console.log(evt.target.error.code);
		}
		
		/*
		function chmodRWRWR(fileName){
			console.log("Starting chmodRWRWR:var...");
			var exec = require('child_process').exec, child;
			
			console.log("Starting chmodRWRWR:child...");
			child = exec('ls',
				function (error, stdout, stderr) {
					console.log('stdout: ' + stdout);
					console.log('stderr: ' + stderr);
					if (error !== null) {
						 console.log('exec error: ' + error);
					}
				});
			child();
		}
		*/
		
		/* gotFile just has some code which was useful for the dataStream, might be able to re-use some for the copy-files export method
		function gotFile(file){
			console.log("Got the File");
			console.log("Type: " + file.type);
			console.log("Path: " + file.fullPath);
			//manually set path?
			//file.fullPath = fullPath = cordova.file.dataDirectory.replace('file://', '') + 'files/' + file.name;
			file.fullPath = fullPath = cordova.file.dataDirectory + 'files/' + file.name;
			console.log("Path: " + file.fullPath);
			console.log("Bytes: " + file.size);
			
			console.log("called the file func on the file ob");
			var reader = new FileReader();
			reader.onloadend = function(evt) {
					console.log('Reader status "onloadend": '+reader.readyState);
					console.log(reader.result);
					
					//mail(reader.result);
					
					var filename         = "bear1.jpg";
					var attachmentBase64 = reader.result; // This should be your base64-string

					var base64parts = attachmentBase64.split(',');
					base64parts[0] = "base64:" + escape(filename) + "//";
					var compatibleAttachment =  base64parts.join("");

					mail(reader.result)
					
			};
			reader.onerror = function(e) {
                console.log('Error.code: '+reader.error.code)
                console.log('Error.message: '+reader.error.message)
            }
			console.log("Reader status before: "+reader.readyState);
			reader.readAsDataURL(file);
			console.log("Reader status after: "+reader.readyState);
			reader.readAsText(file);
		}
		*/
		
		//mailSingle(fileName) takes a single file with the same name as one in the public directory and attaches it to an email.
		function mailSingle(fileName){ 
			console.log("attempting to send email...");

			$cordovaEmailComposer.isAvailable().then(function() {
				console.log("Email is available");
				var email = {
					to: 'cobbsworth@outlook.com',
					cc: '',
					attachments: 
					[
					'base64:text.txt//'+btoa("Hello World"),
					//'file://img/logo.png'
					//cordova.file.dataDirectory + "files/" + fileName
					],
					subject: 'Cordova Email',
					body: '',
					isHtml: false
				};

				$cordovaEmailComposer.open(email).then(null, function () {
				   console.log("Email Cancelled");
				});
			}, function () {
			   console.log("Email is unavailable");
			});
		}
	};

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
            
            var movements = ["Unknown", "Walking", "Wading", "Standing", "Laying dowm","Sitting", "Running", "Swimming","Climbing",];
            
            var actions = ["Unknown","Fishing","Watching Bears", "Watching humans", "Consuming", "Interacting with humans","Interacting with Bears", "Grooming", "Sleeping", "Vigilant", "Fighting"];
            
            var attitudes = ["Unknown", "Avoiding Humans","Avoiding Bears","Socializing","Aggresive","Passive","Alert","Enticing"];
            
            $scope.movements = movements;
            $scope.actions = actions;
            $scope.attitudes = attitudes;
            
})

.controller('bearSpecCtrl', function($scope) {
            
            
})