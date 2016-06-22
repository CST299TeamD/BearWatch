angular.module('app.controllers')

.controller('homeCtrl', function($scope, $ionicPopup, $location, $ionicNavBarDelegate, Session) {
    
    //hide back button
    $ionicNavBarDelegate.showBackButton(false);
	
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
	
})

//Activates the GPS
.controller('geolocationController', function(GPS) {
	GPS.refresher();
})

.controller('startNewSessionCtrl', function($scope, Session, Park, $location, $state, $ionicNavBarDelegate, $ionicScrollDelegate) {

    $ionicNavBarDelegate.showBackButton(true);

    //scroll top function
    $scope.scrollDown = function(){
        $scope.showHelp = true;
        $ionicScrollDelegate.$getByHandle('startScroll').resize();
        $ionicScrollDelegate.$getByHandle('startScroll').anchorScroll(true);
        $ionicScrollDelegate.$getByHandle('startScroll').scrollBottom(true);
    }

    //hide help function
    $scope.hideHelp = function() {
        $scope.showHelp = false;
    }            
	
	//global factory session object
	$scope.Session = Session;

	$scope.parkChecked = false;

	$scope.zoneList = '';

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
            $scope.zoningSchemaPic = 'img/river.png';
            $scope.zoneList = ["4", "5", "6"];
        } else if(zoningSchemaSelect == "Estuary"){
            $scope.zoningSchemaPic = 'img/estuary.png';
            $scope.zoneList = ["4", "6"];
        } else if(zoningSchemaSelect == "Terrestrial"){
            $scope.zoningSchemaPic = 'img/terrestrial.png';
            $scope.zoneList = '';
        } else {
            $scope.zoningSchemaPic = '';
        }
    }

    //validation function
    $scope.validate = function(form){
    	$scope.submitted = true;
    	if(form.$valid && $scope.parkChecked && Session.firstName == '' && Session.lastName == '' && Session.nameResult.length != 0) {
	    	$state.go('startNewSessionCont');
	    }
    }
})

.controller('startNewSessionContCtrl', function($scope, Enviro, $ionicScrollDelegate, $location, $state) {
	
	//global factory environment object
	$scope.Enviro = Enviro;

	//scroll top function
    $scope.scrollDown = function(){
        $scope.showHelp = true;
        $ionicScrollDelegate.$getByHandle('startContScroll').resize();
        $ionicScrollDelegate.$getByHandle('startContScroll').anchorScroll(true);
        $ionicScrollDelegate.$getByHandle('startContScroll').scrollBottom(true);
    }

    //hide help function
    $scope.hideHelp = function() {
        $scope.showHelp = false;
    }

    //validation function
    $scope.validate = function(form){
    	$scope.submitted = true;
    	if(form.$valid) {
	    	$state.go('observationMode');
	    }
    }
			            
})

.controller('observationModeCtrl', function($scope, $cordovaSQLite, Session, Enviro, $location, $state, $ionicPopup, $ionicScrollDelegate, $ionicLoading, $timeout) {

	//scroll top function
    $scope.scrollDown = function(){
        $scope.showHelp = true;
        $ionicScrollDelegate.$getByHandle('obsScroll').resize();
        $ionicScrollDelegate.$getByHandle('obsScroll').anchorScroll(true);
        $ionicScrollDelegate.$getByHandle('obsScroll').scrollBottom(true);
    }

    //hide help function
    $scope.hideHelp = function() {
        $scope.showHelp = false;
    }
	
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
		if(form.$valid && (Session.hr != undefined || Session.min != undefined) || Session.surveySched == 'Opportunistic') {
    		// Setup the loader
			$ionicLoading.show({
				template: '<h2>Updating</h2>',
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: false,
				maxWidth: 200,
				showDelay: 0
			});
    		//save session THEN save environment using session id
			Session.save()
			.then(
				function(result){
					Enviro.save(result.insertId);
					$timeout(function () {
						$ionicLoading.hide();
					}, 300);
					$state.go('tab.bear');
				}, 
				function(error){
					var alertPopup = $ionicPopup.alert({
						title: 'Session Error',
						template: 'Error saving session information, please try again. Restart BearWatch if behavior continues.'
					});

					alertPopup.then(function(res) {
						console.log("Error Found: " + error);
					});
				}
			);
	    }
	}

});
