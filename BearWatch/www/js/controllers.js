angular.module('app.controllers', [])
  
.controller('homeCtrl', function($scope) {	
	//continue session TODO:
	//if session is not complete (no observation mode), remove from DB 
	//disable contiue button if no valid sessions available
})

//TODO: Remove test code before deployment
//application test code and example functions
.controller( 'dbTest', function ($scope, $cordovaSQLite, Session, Enviro){
	$scope.Session = Session;
	$scope.Enviro = Enviro;
    $scope.result = "TEST INITIALIZED";
    $scope.success = db_success;
	$scope.fail = db_error;
	$scope.status = "$scope.Session.nameResult: " + $scope.Session.nameResult;
	
	$scope.testing = function (){
		$scope.test = "--$scope.Session-- ";
		for(item in $scope.Session){
			$scope.test += item + " : ";
			if(item == 'nameResult'){
				for(name in $scope.Session[item]){
					$scope.test += $scope.Session[item][name] + ", ";	
				}
			}else{
				$scope.test += $scope.Session[item] + ", ";
			}	
		}	 
	}

	
	$scope.enviroTesting = function (){
		$scope.enviroTest = "--$scope.Enviro-- ";
		for(item in $scope.Enviro){
			$scope.enviroTest += item + " : " + $scope.Enviro[item] + ", ";	
		}
		 
	}


	$scope.insert = function() {			
		$cordovaSQLite.execute(db, 'INSERT INTO sessions (observers) VALUES (?)', [$scope.data])
        .then(function(result) {
            $scope.result = "Observer name saved successful, cheers!";
			$scope.status = "Insert result: " + result;
        }, function(error) {
            $scope.result = "Error on saving: " + error.message;
        })
	}
	
	//select example
    $scope.select = function() {
		// Execute SELECT statement to load message from database.
        $cordovaSQLite.execute(db, 'SELECT * FROM sessions WHERE session_id = (?)' [Sessions.id])
            .then(
                function(result) {
                    if (result.rows.length > 0) {
                        $scope.status = result.rows.item(0).session_id;
                        $scope.result = "Observer name loaded successful, cheers!";
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

.controller('startNewSessionCtrl', function($scope, Session) {
	//global debug var
	$scope.debug = debug;
	
	//global factory session object
	$scope.Session = Session;

	//function for adding observers
	$scope.addObserver = function(observer){
		//check for empty string
		if(observer != '' && observer != null){
			$scope.Session.nameResult.push(observer);
			//clear textfield
			$scope.Session.observer = '';
		}
	}

	//function to clear observer name from list
	$scope.clearObserver = function (observer){
		var index = $scope.Session.nameResult.indexOf(observer);
  		$scope.Session.nameResult.splice(index, 1); 
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

.controller('startNewSessionContCtrl', function($scope, Enviro) {
	
	//global factory environment object
	$scope.Enviro = Enviro;
			            
})

.controller('observationModeCtrl', function($scope, $cordovaSQLite, Session, Enviro) {
	//global debug var
	$scope.debug = debug;	
	
	//global factory session/enviro objects
	$scope.Session = Session;
	$scope.Enviro = Enviro;
	
	//TODO: DB entry - CC

	
	var insertResult = "Not initialized";
	var selectResult = "Not initialized";
	$scope.insertResult = insertResult;
	$scope.selectResult = selectResult;

	$scope.testInsert = function(){
		$scope.insertResult = "Initialized";
		$scope.insertResult = Session.save();
	}

	$scope.testSelect = function(){
		$scope.selectResult = "Initialized";
		$cordovaSQLite.execute(db, 'SELECT * FROM sessions WHERE session_id = (?)', [Sessions.id])
            .then(
                function(result) {
                    if (result.rows.length > 0) {
                        $scope.selectResult = "result: " + result.rows.item(0);
            			for(item in result.rows.item(0)){
            				$scope.selectResult += ", " + item;
            			}
                    }
                },
                function(error) {
                    $scope.selectResult = "Error on loading: " + error.message;
                }
            );
	}

})

.controller('bearCtrl', function($scope, $cordovaSQLite, BearList, Bear, $location) {
	
	$scope.BearList = BearList;
	$scope.Bear = Bear;
	$scope.bearTest = 55;

	$scope.changeBear = function(index){
		$scope.bearTest = "Initialized";
		var tmp = BearList.add[index];
		$scope.bearTest = "bear name: " + tmp.name;
		
		$scope.Bear.name = tmp.name;
		$scope.Bear.zone = tmp.location;
		$scope.Bear.size = tmp.size;
		$scope.Bear.age = tmp.age;
		$scope.Bear.gender = tmp.gender;
		$scope.Bear.species = tmp.species;
		$scope.Bear.markDescription = tmp.markDescription;
		$scope.Bear.furColour = tmp.furColour;
		$scope.Bear.pawMeasered = tmp.pawMeasured;
		$scope.Bear.cubs = tmp.cubs;
		$scope.Bear.cubFurColour = tmp.cubFurColour;
		$scope.Bear.cubAge = tmp.cubAge;
		$scope.Bear.behaviour = tmp.behaviour;
		$scope.Bear.comment = tmp.comment;
		//$location.path("/BearInfo");		
	}
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
								            }
							);
            }

            //get the session id from the factory ---yet to be coded
            var session_id = 1;
            $scope.sesion_id = session_id;
})



.controller('addBearCtrl', function($scope, $cordovaSQLite, Bear, BearList) {

	//fake session id
   	var session_id = 1; 
   	$scope.session_id = session_id;
	$scope.Bear = Bear;
	$scope.BearList = BearList;
  	$scope.Bear.name = '';
    $scope.Bear.zone = '';
    $scope.Bear.size = '';
    $scope.Bear.age = '';
    $scope.Bear.gender = '';
    $scope.Bear.species = '';
    $scope.Bear.markDescription = '';
    $scope.Bear.furColour = '';
    $scope.Bear.pawMeasered = '';
    $scope.Bear.cubs = '';
    $scope.Bear.cubFurColour = '';
    $scope.Bear.cubAge = '';
    $scope.Bear.behaviour = [];
    $scope.Bear.comment = '';

   	var sIdInsertResult = "Not Initialized";
	var bearInsertResult = "Not Initialized";
	$scope.bearInsertResult = bearInsertResult;
	$scope.sIdInsertResult = sIdInsertResult;
	
	
	//insert fake row in the database for session id
	$scope.testInsert = function(){
	$scope.sIdInsertResult = "Initialized";
	$cordovaSQLite.execute(db, 'INSERT INTO sessions (session_id) VALUES (?)', [1])
    .then(function(result) {
        $scope.sIdInsertResult = "Session id inserted";
    }, function(error) {
        $scope.sIdInsertResult = "Error on inserting: " + error.message;
    })

	}

	//add bear to fake session id - to be updated
	$scope.addBear = function(){
		//insert into bears table
		$cordovaSQLite.execute(db, 'INSERT INTO bears (bear_name, bear_location, size, age, gender, species, '
								  +'mark_desc, fur_colour, paw_measure, cubs, cub_fur, cub_age, comment, '
								  +	'session_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
									[$scope.Bear.name, $scope.Bear.zone, $scope.Bear.size, $scope.Bear.age, $scope.Bear.gender,
									$scope.Bear.species, $scope.Bear.markDescription, $scope.Bear.furColour, $scope.Bear.pawMeasered,
									$scope.Bear.cubs, $scope.Bear.cubFurColour, $scope.Bear.cubAge, $scope.bearComment, $scope.session_id])
	    	.then(function(result) {
    	    	$scope.bearInsertResult = "Bear inserted";
    	    	$scope.BearList.add.push({
    	    		id: result.insertId,
    	    		name: $scope.Bear.name,
    	    		location: $scope.Bear.zone,
    	    		size: $scope.Bear.size,
    	    		age: $scope.Bear.age,
    	    		gender: $scope.Bear.gender,
    	    		species: $scope.Bear.species,
    	    		markDescription: $scope.Bear.markDescription,
    	    		behaviour: [],
    	    		furColour: $scope.Bear.furColour,
    	    		pawMeasured: $scope.Bear.pawMeasered,
    	    		cubs: $scope.Bear.cubs,
    	    		cubFurColour: $scope.Bear.cubFurColour,
    	    		cubAge: $scope.Bear.cubAge,
    	    		comment: $scope.bearComment
    	    	});
                        
    		}, function(error) {
       	 		$scope.bearInsertResult = "Error on inserting Bear: " + error.message;
    		})
	}
   	var numret = 0;
   	$scope.numret = numret;
   	//select example
    $scope.testSessionId = function() {
    	$scope.result = "Initialized";
		// Execute SELECT statement to load message from database.
        $cordovaSQLite.execute(db, 'SELECT bear_name FROM bears WHERE session_id = ?', [1])
            .then(
                function(result) {
                	$scope.result = "Result Positive but no rows";
                	$scope.rows = result.rows.length;
             	  	$scope.numret = result.rows.length;
                    if (result.rows.length > 0) {

                        $scope.status = result.rows.item(0).bear_name;
                        $scope.result = "Data in bear table - " + $scope.status;
                    }
                },
                function(error) {
                    $scope.result = "Error on loading: " + error.message;
                }
            );
    }
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

.controller('environmentCtrl', function($scope, Enviro) {
	//global factory enviro object
	$scope.Enviro = Enviro;
            
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

.controller('tabCommentCtrl', function($scope) {

})

.controller('tabCameraCtrl', function($scope, $cordovaCamera, $cordovaFile, $cordovaEmailComposer, $cordovaSQLite) {
	$scope.debug = debug;
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
			//$scope.mailProgress ="starting function";
			//mailSinglePicture(imageData);
		}, function (err) {
			// An error occured
			$scope.cameraResult = "Camera error: " + err;
		});
	}
	
	//save photo to session - not working properly TODO: test with file/io
	$scope.choosePhoto = function () {
		
		$scope.insertResult = "Initialized";

/*		//Little chunk of code to clear all logs, was used for testing inserts.
		$cordovaSQLite.execute(db, 'DELETE FROM logs')
        .then(function(result) {
            $scope.deleteResult = "deleted";
        }, function(error) {
            $scope.deleteResult = "Error on delete: " + error.message;
            return;
        })
*/
		//Put a single picture taken into logs table. TODO: Session id, timestamps, GPS
		$cordovaSQLite.execute(db, 'INSERT INTO logs (picture_data) VALUES (?)', [$scope.imageInfo])
        .then(function(result) {
            $scope.insertResult = "Picture insert successful! Probably...";
        }, function(error) {
            $scope.insertResult = "Error on saving: " + error.message;
            return;
        })


		$scope.selectResult = "Initialized";
        $cordovaSQLite.execute(db, "SELECT log_id, picture_data FROM logs").then(
            function(result) {
                //$scope.selectResult = "Select successful!";
                $scope.selectResult += "...Select successful! Rows length = " + result.rows.length;
                if (result.rows.length > 0) {
                    $scope.fileName = "Select successful!";
                    var i=0;
                    while(i < result.rows.length){
                    	$scope.selectResult += "...log_id: "+result.rows.item(i).log_id;//+"...Picture_data: "+result.rows.item(i).picture_data;
                    	i++;
                    }
                } else {
                	$scope.selectResult += "...No rows found"
                }
            },
            function(error) {
                $scope.selectResult = "Error on loading: " + error.message;
            }
        );


		/*
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
		*/

	}
	
	//discard photo - TODO: fix this...
	$scope.discardPhoto = function () {
		$scope.imgURI;
		$scope.cameraResult = "Clearing photo - reloading screen";
		$state.go($state.current, {}, {reload: true});
	}

})


//Controller loaded when "Review Sessions" is selected"
.controller('reviewListCtrl', function($scope, $cordovaEmailComposer, $cordovaSQLite) {
	
	//$scope.result = '...starting reviewListCtrl';
	document.addEventListener("deviceready", onDeviceReady, false);

	function onDeviceReady() {
		$scope.result = ('...dataDirectory: '+cordova.file.dataDirectory);
		
	}	

	//test function to mail pictures
	$scope.reviewSendPicture = function() {

		//instantiate array to hold all email attachments
		var emailAttachments = []

		//Attach CSV(s)
		//place holder -- this should actually be a huge text CSV with an entire session of data
		var csv1contents = "Hello, World, Of, Bears"
		emailAttachments.push('base64:csv1.csv//'+btoa(csv1contents));


		//Get logs, add to attachment array TODO - specify session
		$scope.selectResult = "Initialized";
        $cordovaSQLite.execute(db, "SELECT log_id, picture_data FROM logs").then(
            function(result) {
                $scope.selectResult += "...Select successful! Rows length = " + result.rows.length;
                if (result.rows.length > 0) {
                    $scope.fileName = "Select successful!";
                    var i=0;
                    while(i < result.rows.length){
                    	$scope.selectResult += "...log_id: "+result.rows.item(i).log_id;
                    	emailAttachments.push("base64:picture"+i+".jpg//" + result.rows.item(i).picture_data);
                    	i++;
                    }
                } else {
                	$scope.selectResult += "...No rows found"
                }
            },
            function(error) {
            	//TODO - GIVE USER FEEDBACK
                $scope.selectResult = "Error on loading: " + error.message;
            }
        );

        //Send/draft email
		$scope.mailProgress = "...attempting to send email with " + emailAttachments.length + " attachments";
		try{
			$cordovaEmailComposer.isAvailable().then(function() {
				$scope.mailProgress = "...Email is available";
				var email = {
					//TODO - set proper email & mail contents
					to: 'cobbsworth@outlook.com',
					cc: '',
					attachments: emailAttachments,
					subject: 'Cordova Email',
					body: '',
					isHtml: false
				};

				$cordovaEmailComposer.open(email).then(null, function () {
				   //$scope.mailProgress = "...Email Cancelled";
				});
			}, function () {
			   $scope.mailProgress = "...Email is unavailable";
			});
		} catch (exception){
			$scope.mailProgress = exception.name + " ::: " + exception.message;
		}
	}

	//Test function to save mail text
	$scope.reviewSaveSendCSV = function () {

		//$scope.result += '...starting reviewSaveCSV';
		mail("hello, world");
		//$scope.result += '...mail sent'
		
		//copyToPublic("bear1.jpg");
/*		
		//copyToPublic takes a string name of a file and looks for it in the dataDirectory, then runs sendFileEntryToPublic on it
		function copyToPublic(fileName){
			var filePath = cordova.file.dataDirectory + "files/" + fileName;
			window.resolveLocalFileSystemURL(filePath, sendFileEntryToPublic, fail);
		}
*/
/*
		//sendFileEntryToPublic takes a file and moves it to a public directory
		function sendFileEntryToPublic(fileEntry) {
			//$scope.result += "...gotFileEntry: "+fileEntry.name;
			//$scope.result += "...fileEntry fullpath: "+fileEntry.fullPath;			
			//$scope.result += "...copying to..." + cordova.file.dataDirectory;		
			//$scope.result += "...copying to..." + cordova.file.externalDataDirectory;
			
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
							//mailSingle(fileEntry.name);
						},
						function() {alert('unsuccessful copying')}
					);
				}, 
				fail);

		}
*/

		function fail(evt) {
			//$scope.result += "..."+evt.target.error.code;
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
		function mail(csv1contents){ 
			//$scope.result += "...attempting to send email";

			$cordovaEmailComposer.isAvailable().then(function() {
				//$scope.result += "...Email is available";
				var email = {
					to: 'cobbsworth@outlook.com',
					cc: '',
					attachments: 
					[
					'base64:csv1.csv//'+btoa(csv1contents)
					//'file://img/logo.png'
					//cordova.file.dataDirectory + "files/" + fileName
					],
					subject: 'Cordova Email',
					body: '',
					isHtml: false
				};

				$cordovaEmailComposer.open(email).then(null, function () {
				   //$scope.result += "...Email Cancelled";
				});
			}, function () {
			   //$scope.result += "...Email is unavailable";
			});
		}
	};

})

.controller('bearInfoCtrl', function($scope, Bear) {
            
            $scope.Bear = Bear;

            
            var feeding = ["Pursuit for food", "Green Vegetation", "Berries", "Fishing", "Human Food"];
            var nonInteractive = ["Loafing/Resting", "Sleeping", "Waling", "Running"];
            var bBInteraction =["Alert/Vigilance", "Playing", "Fighting", "Defense"];
            var bHInteraction = ["Alert/Vigilance", "Retreat", "Bear Approach"];
            var hBinteraction = ["Alert/Vigilance", "Retreat", "Approach Bear", "Aggression "];
            var habituationLevel = ["Habituated", "Non- Habituated", "SUbadult"];
            
            $scope.feeding = feeding;
            $scope.nonInteractive = nonInteractive;
            $scope.bBInteraction = bBInteraction;
            $scope.bHInteraction = bHInteraction;
            $scope.hBinteraction = hBinteraction;
            $scope.habituationLevel= habituationLevel;
            
            var movements = ["Unknown", "Walking", "Wading", "Standing", "Laying dowm","Sitting", "Running", "Swimming","Climbing",];
            
            var actions = ["Unknown","Fishing","Watching Bears", "Watching humans", "Consuming", "Interacting with humans","Interacting with Bears", "Grooming", "Sleeping", "Vigilant", "Fighting"];
            
            var attitudes = ["Unknown", "Avoiding Humans","Avoiding Bears","Socializing","Aggresive","Passive","Alert","Enticing"];
            
            $scope.movements = movements;
            $scope.actions = actions;
            $scope.attitudes = attitudes;
            
})

.controller('bearSpecCtrl', function($scope) {
            
            
})