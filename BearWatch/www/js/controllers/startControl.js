angular.module('app.controllers')

.controller('homeCtrl', function($scope, $ionicPopup) {	
	//global debug var
	$scope.debug = debug;
	
	//Warn user if database cannot be created
    if(db_error == true){
      var alertPopup = $ionicPopup.alert({
        title: 'Data Warning',
        template: 'File save was not initialized - data may not be stored properly. Make sure you have enough free memory and try restarting the application.'
      });

      alertPopup.then(function(res) {
        console.log('DB warning issued');
      });
    }

   	//continue session TODO:
	//if session is not complete (no observation mode), remove from DB 
	//disable contiue button if no valid sessions available
})

//Activates the GPS
.controller('geolocationController', function(GPS) {
	GPS.refresher();
})

//TODO: Remove test code before deployment
//application test code and example functions
.controller( 'dbTest', function ($scope, $cordovaSQLite, Session, Enviro){
	$scope.Session = Session;
	$scope.Enviro = Enviro;
    $scope.result = "TEST INITIALIZED";
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

.controller('startNewSessionCtrl', function($scope, Session, Park, $location, $state) {
	//global debug var
	$scope.debug = debug;
	
	//global factory session object
	$scope.Session = Session;

	$scope.parkChecked = false;

	//function for adding observers
	$scope.addObserver = function(){
		//check for empty string
		if(Session.firstName != '' && Session.lastName != ''){
			var name = Session.firstName + ' ' + Session.lastName;
			$scope.Session.nameResult.push(name);
			//clear textfield
			Session.firstName = '';
			Session.lastName = '';
		}
	}

	//function to clear observer name from list
	$scope.clearObserver = function (observer){
		var index = $scope.Session.nameResult.indexOf(observer);
  		$scope.Session.nameResult.splice(index, 1); 
	}

	$scope.parkNames = Park.parkNames;
	var showList = true;
	$scope.showList = showList;

	$scope.parkSelected = function(){
		$scope.showList = false;
		$scope.parkChecked = true;
	}

	$scope.changePark = function(){
		$scope.showList = true;
	}

	$scope.clearPark = function(){
		Session.park = '';
		$scope.parkChecked = false;
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

    //validation function
    $scope.validate = function(form){
    	console.log("Submitting");
    	$scope.submitted = true;
    	if(form.$valid && $scope.parkChecked && Session.firstName == '' && Session.lastName == '' && Session.nameResult.length != 0) {
    		console.log("Form Valid");
	    	$state.go('startNewSessionCont');
	    }
    }
})

.controller('startNewSessionContCtrl', function($scope, Enviro) {
	
	//global factory environment object
	$scope.Enviro = Enviro;
			            
})

.controller('observationModeCtrl', function($scope, $cordovaSQLite, Session, Enviro, $location, $state, $ionicPopup) {
	//global debug var
	$scope.debug = debug;	
	
	//global factory session/enviro objects
	$scope.Session = Session;
	$scope.Enviro = Enviro;
	
	var insertResult = "Not initialized";
	var selectResult = "Not initialized";
	$scope.insertResult = insertResult;
	$scope.selectResult = selectResult;

	//function to save session and initial enviro data
	$scope.saveSession = function(form){
		
		$scope.submitted = true;

		//validate input
		if(form.$valid && (Session.hr != undefined || Session.min != undefined)) {
    		console.log("Form Valid");
    		//save session THEN save environment using session id
			Session.save()
			.then(
				function(result){
					Enviro.save(result.insertId);
					$state.go('tab.bear');
				}, 
				function(error){
					var alertPopup = $ionicPopup.alert({
						title: 'Session Error',
						template: 'Error saving session information, please try again. Restart BearWatch if behavior continues.'
					});

					alertPopup.then(function(res) {
						console.log("saveSession error: " + error.message);
					});
				}
			);
	    }
	}

});
