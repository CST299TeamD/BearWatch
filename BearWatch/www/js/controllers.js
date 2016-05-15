angular.module('app.controllers', [])
  
.controller('homeCtrl', function($scope) {	
	//continue session TODO:
	//if session is not complete (no observation mode), remove from DB 
	//disable contiue button if no valid sessions available
})

.controller('startNewSessionCtrl', function($scope, $cordovaSQLite) {
	$scope.debug = debug;

	//db insert values
	$scope.nameResult = [];

	//function for adding observers
	$scope.observer = {};
	$scope.addObserver = function(observer){
		//check for empty string
		if(observer != '' && observer != null){
			$scope.nameResult.push(observer);
			//clear textfield
			$scope.observer.txt = '';
		}
	}

	//function to clear observer name from list
	$scope.clearObserver = function (observer){
		var index = $scope.nameResult.indexOf(observer);
  		$scope.nameResult.splice(index, 1); 
	}

	//TODO: DB entry



            
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

.controller('bearCtrl', function($scope) {
            
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



.controller('addBearCtrl', function($scope) {

})

.controller('humanCtrl', function($scope) {
	
	//vars for counting motorized vehicle numbers
	var aircraftNum = 0;
	var atvNum = 0;
	var boatNum = 0;
	var carNum = 0;
	
	//for input objects for controller manipulation
	$scope.aircraft = {};
	$scope.atv = {};
	$scope.motoBoat = {};
	$scope.vehicle = {};
	
	//test data for zone matrix - TODO: dynamically attribute from zone selection
	//estuary hard-coded
	$scope.zones = ["+1", "1", "4", "7", "7+", "2+", "2", "5", "8", "8+", "6"];
	
	//esturary zone image - hard coded TODO:needs to be dynamic
	$scope.zoneImgURI = "img/estuary.png"
	
	//motorized observation button list
	$scope.motoActions = ["Passing through", "Staying in area"];
	$scope.activeVehicles = [];	
	
	//function to record motorized actions
	$scope.recordMoto = function(motoType, action, description){

		if(action != 'departed'){
			//placeholder for vehicle name
			var time = new Date();
			var vehicleName = "" + time.toLocaleTimeString() + " ";
				
			//update vehicle number
			switch(motoType){
				case 'Aircraft':
					aircraftNum ++;
					vehicleName += motoType + '-' +  aircraftNum;
					if($scope.aircraft.txt != undefined) $scope.aircraft.txt = '';
					break;
				case 'ATV':
					atvNum ++;
					vehicleName += motoType + '-' +  atvNum;
					if($scope.atv.txt != undefined) $scope.atv.txt = '';
					break;
				case 'Boat':
					boatNum ++;
					vehicleName += motoType + '-' +  boatNum;
					if($scope.motoBoat.txt != undefined) $scope.motoBoat.txt = '';
					break;
				case 'Vehicle':
					carNum ++;
					vehicleName += motoType + '-' +  carNum;
					if($scope.vehicle.txt != undefined) $scope.vehicle.txt = '';
					break;
			}
			//add descrtiptor if available
			if(description != '' && description != null){
				vehicleName += ' ' + description;	
			}
			
			if (action == 'Staying in area'){
				//add to active list
				$scope.activeVehicles.push(vehicleName);
			}
			//TODO: update log table
		}else{
			var index = $scope.activeVehicles.indexOf(motoType);
  			$scope.activeVehicles.splice(index, 1);
			 //TODO: update database 
		}
	}

})

.controller('environmentCtrl', function($scope) {
            
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

//TODO: Remove test code before deployment
//application test code and example functions
.controller( 'dbTest', function ($scope, $cordovaSQLite){
	
    $scope.result = "TEST INITIALIZED";
    $scope.success = db_success;
	$scope.fail = db_error;


	$scope.insert = function() {			
		$cordovaSQLite.execute(db, 'INSERT INTO bear_logs (bear_name) VALUES (?)', [$scope.data])
        .then(function(result) {
            $scope.result = "Bear name saved successful, cheers!";
        }, function(error) {
            $scope.result = "Error on saving: " + error.message;
        })
	}
	
	//select example
    $scope.select = function() {
		// Execute SELECT statement to load message from database.
        $cordovaSQLite.execute(db, 'SELECT * FROM bear_logs ORDER BY bear_log_id DESC')
            .then(
                function(result) {

                    if (result.rows.length > 0) {

                        $scope.status = result.rows.item(0).bear_name;
                        $scope.result = "Bear name loaded successful, cheers!";
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

.controller('tabCommentCtrl', function($scope) {

})

.controller('tabCameraCtrl', function($scope, $cordovaCamera, $cordovaFile) {
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
	
	//save photo to session - not working properly TODO: test with file/io
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
	
	//discard photo - TODO: fix this...
	$scope.discardPhoto = function () {
		$scope.imgURI;
		$scope.cameraResult = "Clearing photo - reloading screen";
		$state.go($state.current, {}, {reload: true});
	}

})

//Controller loaded when "Review Sessions" is selected"
.controller('reviewListCtrl', function($scope, $cordovaEmailComposer) {
	
	console.log('starting reviewListCtrl');
	document.addEventListener("deviceready", onDeviceReady, false);

	function onDeviceReady() {
		$scope.result = "Starting test...";
		console.log('dataDirectory: '+cordova.file.dataDirectory);
		
	}	
	
	//Test function to save a file locally
	$scope.reviewSaveSendCSV = function () {
		$scope.result += "Starting SaveSendCSV...";
		console.log('starting reviewSaveCSV');
		
        //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
		/*
		function readTextFile(fileEntry) {
			fileEntry.file(function (file) {
				var reader = new FileReader();

				reader.onloadend = function() {
					console.log("Successful file read: " + this.result);
					//displayFileData(fileEntry.fullPath + ": " + this.result);
				};

				reader.readAsText(file);

			}, null);
		}
		function readFile(fileEntry) {
			console.log("fileEntry.fullPath: " + fileEntry.fullPath);
			fileEntry.file(function (file) {
				var reader = new FileReader();

				reader.onloadend = function() {
					console.log("Successful file read: " + this.result);
					//displayFileData(fileEntry.fullPath + ": " + this.result);
				};
				

				reader.readAsDataURL(file);

			}, function(evt){
				console.log("Failed to read file. Error: " + evt);
			});
		}
		
		function writeFile(fileEntry, dataObj) {
			// Create a FileWriter object for our FileEntry (log.txt).
			fileEntry.createWriter(function (fileWriter) {

				fileWriter.onwriteend = function() {
					console.log("Successful file read...");
					readFile(fileEntry);
				};

				fileWriter.onerror = function (e) {
					console.log("Failed file read: " + e.toString());
				};

				// If data object is not passed in,
				// create a new Blob instead.
				if (!dataObj) {
					dataObj = new Blob(['some file data'], { type: 'text/plain' });
				}

				fileWriter.write(dataObj);
				console.log("Wrote Data: " + dataObj);
			});
		}
	
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

			console.log('file system open: ' + fs.name);
			fs.root.getFile("testtext.txt", { create: false, exclusive: false }, function (fileEntry) {

				console.log("fileEntry is file? " + fileEntry.isFile.toString());
*/				// fileEntry.name == 'someFile.txt'
//				fileEntry.fullPath = cordova.file.dataDirectory/*.replace('file://', '')*/ 
//				+ 'files/testtext.txt'
//				console.log("Saving to: " + fileEntry.fullPath);
				//writeFile(fileEntry, null);
				
				//readFile(fileEntry);
				
				/* Email test start! */
				
//				console.log("attempting to send email...");
				/*console.log('base64:text.txt//'+'helloworld');
				console.log('base64:text.txt//'+btoa('helloworld'));
				console.log('base64:picture.png//'+btoa(readFile(fileEntry)));
				console.log('base64:picture.png//'+readFile(fileEntry));				
				console.log('base64:picture.png//'+readTextFile(fileEntry));
				*/
/*				$cordovaEmailComposer.isAvailable().then(function() {
					console.log("Email is available");
					var email = {
						to: 'cobbsworth@outlook.com',
						cc: '',
						attachments: [
						'base64:text.txt//'+btoa('helloworld'),
						'base64:picture.png//'+btoa(readFile(fileEntry)),
					
						],
						subject: 'Cordova Email',
						body: 'How are you? Nice greetings from Leipzig',
						isHtml: false
					};

					$cordovaEmailComposer.open(email).then(null, function () {
					   console.log("Email Cancelled");
					});
				}, function () {
				   console.log("Email is unavailable");
				});
*/				
				/* Email test end! */
/*				
				
			}, function(){
				console.log("Failed to getFile()");
			});

<<<<<<< HEAD
		}, function(){
			console.log("Failed to RequestFileSystem");
		});
*/

/*		function gotFS(fileSystem) {
			console.log("getFS"+fileSystem);
			fileSystem.root.getFile("files/bear1.jpg", null, gotFileEntry, fail);
		}
*/
/*

		function gotFileEntry(fileEntry) {
			console.log("gotFileEntry: "+fileEntry.name);
			console.log("fileEntry fullpath: "+fileEntry.fullPath);
			fileEntry.file(gotFile, fail);
		}

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

					mail(reader.result);
					//window.plugin.email.open({
					//	attachments: [compatibleAttachment]
					//});
					
			};
			reader.onerror = function(e) {
                console.log('Error.code: '+reader.error.code)
                console.log('Error.message: '+reader.error.message)
            }
			console.log("Reader status before: "+reader.readyState);
			reader.readAsDataURL(file);
			console.log("Reader status after: "+reader.readyState);
			reader.readAsText(file);
			//readDataUrl(file);
		}
		*/
/*
		function readDataUrl(file) {
			console.log("readDataURL - size: "+file.size);
			var reader = new FileReader();
			reader.onloadend = function(evt) {
				console.log("Read as data URL");
				console.log("Reader Status: "+reader.readyState);
				console.log("Reader Error: "+reader.error.code);
				if (reader.error.code == reader.error.NOT_FOUND_ERR){
					console.log("File not found error");
				}
				console.log("Result 1: "+evt.target.result);
				console.log("Result 2: "+this.result);
				console.log("Result 3: "+reader.result);
				//mail(this.result);
			};
			console.log("file: " + file.type);
			reader.readAsDataURL(file);
			reader.onload = mail("hello world");
			
		}
*/		

		/*
		function fail(evt) {
			console.log("Error occurred...");
			console.log(this.error.code);
		}
		
		
		var filePath = cordova.file.dataDirectory + "files/bear1.jpg";
		window.resolveLocalFileSystemURL(filePath, gotFileEntry, fail);*/
		mail("");
		
		/*
		window.resolveLocalFileSystemURI(filePath,
			// success callback; generates the FileEntry object needed to convert to Base64 string
			function (fileEntry) {
				// convert to Base64 string
				function win(file) {
					var reader = new FileReader();
					reader.onloadend = function (evt) {
						var obj = evt.target.result; // this is your Base64 string
						console.log("evt.target.result: "+obj);
					};
					reader.readAsDataURL(file);
				};
				var fail = function (evt) { };
				fileEntry.file(win, fail);
			},
			// error callback
			function () { }
		);*/

		
		function mail(pictomail){
			$scope.result += ("attempting to send email...");
			console.log("message: "+pictomail);
			
			/*console.log('base64:text.txt//'+'helloworld');
			console.log('base64:text.txt//'+btoa('helloworld'));
			console.log('base64:picture.png//'+btoa(readFile(fileEntry)));
			console.log('base64:picture.png//'+readFile(fileEntry));				
			console.log('base64:picture.png//'+readTextFile(fileEntry));
			*/
			$cordovaEmailComposer.isAvailable().then(function() {
				console.log("Email is available");
				//console.log('base64:bear1.jpg//'+pictomail.replace("data:image/jpeg;base64,/",""));
				var email = {
					to: 'cobbsworth@outlook.com',
					cc: '',
					attachments: [
					//('base64:bear1.jpg//'+pictomail.replace("data:image/jpeg;base64,",""))
					'base64:text.txt//'+btoa("Hello World")
					//'base64:picture.png//'+btoa(readFile(fileEntry)),
				
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