angular.module('app.controllers')

.controller('homeCtrl', function($scope) {	
	//continue session TODO:
	//if session is not complete (no observation mode), remove from DB 
	//disable contiue button if no valid sessions available
})

.controller('peterTest', function($scope, $cordovaGeolocation) {
	
	document.addEventListener("deviceready", onDeviceReady, false);

	function onDeviceReady() {		
        console.log("navigator.geolocation is Ready");	
	}	
	$scope.getUTM = function() {
		
		$scope.message = "message";
		//$scope.longitude = 5+5;
		//$scope.latitude = "latitude";
		//$scope.easting = "easting";
		//$scope.northing = "northing";
		//$scope.utmBlock = "utmblock";
		
		function onSuccess(position) {
			$scope.latitude = position.coords.latitude;
			$scope.longitude = position.coords.longitude;
				
			//var coords = utmconv.latLngToUtm(position.coords.latitude, position.coords.longitude);

            //setStandardUtm(coords.global.easting, coords.global.northing, coords.global.zone, coords.global.southern);

			//$scope.easting = coords.global.easting;
			//$scope.northing = coords.global.northing;
			//$scope.utmBlock = coords.global.zone;
		}

		// onError Callback receives a PositionError object
		//
		function onError(error) {
			alert('code: '    + error.code    + '\n' +
				  'message: ' + error.message + '\n');
		}

		// Options: throw an error if no update is received every 30 seconds.
		//
		navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true, timeout: 5000, maximumAge: 0});
		//$scope.message = watchID;
		//navigator.geolocation.clearWatch(watchID);
	}
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
		$scope.insertResult = "Saving";
		id = Session.save();
		if(id != '') {
			console.log("Trying envirosave with id " + id);
			//Enviro.save(id);
		}else{
			console.log("no id");
		}
	}

	$scope.testSelect = function(){
		$scope.insertResult = "Initialized: Session_id?:  " + Session.id;
		Enviro.save(Session.id);
		$cordovaSQLite.execute(db, 'SELECT * FROM sessions WHERE session_id = (?)', [Session.id])
            .then(
                function(result) {
                	$scope.selectResult = "Session = ";
                    if (result.rows.length > 0) {
            			for(item in result.rows.item(0)){
            				$scope.selectResult += item + ": " + result.rows.item(0)[item] + ", ";
            			}
                    }
                },
                function(error) {
                    $scope.selectResult = "Error on loading: " + error.message;
                }
            );

        $cordovaSQLite.execute(db, 'SELECT * FROM logs')
        .then(
            function(result) {
            	$scope.selectResult += "Enviro = ";
                if (result.rows.length > 0) {
                	console.log("enviro results returned");
        			for(item in result.rows.item(0)){
        				$scope.selectResult += item + ": " + result.rows.item(0)[item] + ", ";
        			}
                }else{
                	console.log("No enviro results")
                }
            },
            function(error) {
                $scope.selectResult = "Error on loading: " + error.message;
            }
        );
	}

});