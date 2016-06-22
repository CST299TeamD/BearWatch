angular.module('app.controllers')

.controller('humanCtrl', function($scope, $ionicModal, Session, Human, $ionicScrollDelegate, $ionicLoading, $timeout) {

	$scope.Session = Session;
	$scope.Human = Human;
	
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
	
	//determine zone matrix and help image
	switch(Session.zoneSchema){
		case "Estuary":
			Human.zoneMatrix = [{zone: "1+", humans: ''}, {zone: "1", humans: ''}, {zone: "4", humans: ''}, {zone:"7", humans:''}, {zone: "7+", humans: ''}, {zone: "2+", humans: ''}, 
			{zone:"2", humans: ''}, {zone: "5", humans: ''}, {zone: "8", humans: ''}, {zone: "8+", humans: ''}, {zone: "6", humans: ''}];
			$scope.zoneImgURI = "img/estuary.png"
			break;
		case "River":
			Human.zoneMatrix = [{zone: "1+", humans: ''}, {zone: "1", humans: ''}, {zone: "4", humans: ''}, {zone:"7", humans:''}, {zone: "7+", humans: ''}, {zone: "2+", humans: ''}, 
			{zone:"2", humans: ''}, {zone: "5", humans: ''}, {zone: "8", humans: ''}, {zone: "8+", humans: ''}, {zone: "3", humans: ''}, {zone: "3+", humans: ''}, {zone: "6", humans: ''}, {zone: "9", humans: ''}, {zone: "9+", humans: ''}];
			$scope.zoneImgURI = "img/river.png"
			break;
		case "Terrestrial":
			Human.zoneMatrix = [{zone: "1b", humans: ''}, {zone: "1a", humans: ''}, {zone: "4+", humans: ''}, {zone: "7a", humans: ''}, {zone: "7b", humans: ''}, {zone: "1+", humans: ''}, 
			{zone: "1", humans: ''}, {zone: "4", humans: ''}, {zone:"7", humans:''}, {zone: "7+", humans: ''}, {zone: "2+", humans: ''}, {zone:"2", humans: ''}, {zone: "5", humans: ''}, 
			{zone: "8", humans: ''}, {zone: "8+", humans: ''}, {zone: "3+", humans: ''}, {zone: "3", humans: ''}, {zone: "6", humans: ''}, {zone: "9", humans: ''}, {zone: "9+", humans: ''}, {zone: "3b", humans: ''}, {zone: "3a", humans: ''}, 
			{zone: "6+", humans: ''}, {zone: "9a", humans: ''}, {zone: "9b", humans:''}];
			$scope.zoneImgURI = "img/terrestrial.png"
			break;
		default:
			$scope.zoneImgURI = "img/pic_placeholder.png"
	}

	//scroll top function
    $scope.scrollDown = function(){
        $scope.showHelp = true;
        $ionicScrollDelegate.$getByHandle('humanScroll').resize();
        $ionicScrollDelegate.$getByHandle('humanScroll').anchorScroll(true);
        $ionicScrollDelegate.$getByHandle('humanScroll').scrollBottom(true);
    }

    //hide help function
    $scope.hideHelp = function() {
        $scope.showHelp = false;
    }

    $scope.humanSave = function(){
    	// Setup the loader
		$ionicLoading.show({
			template: '<h2>Updating</h2>',
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: false,
			maxWidth: 200,
			showDelay: 0
		});
		Human.save().then(function(result){
			$timeout(function () {
				$ionicLoading.hide();
			}, 300);
		}, function(err){
			console.log("Error Found: " + err);
		});
    }

	//function to show modal for initial zone-matrix population
	var matrixCompleted = false;
	$scope.showMatrix = function(){
		if(matrixCompleted){
			$scope.showZoneMatrix =! $scope.showZoneMatrix
		}else{
			$scope.modal.show();
		}
	};

	//non-motorized save function 
	$scope.nonMotoSave = function(name){
		if(name == 'Other'){
			Human.nonMotoOther = '';
		}
		$scope.humanSave();
	}

	//matrix modal

	//modal function to confirm edit options
	$ionicModal.fromTemplateUrl('templates/humanModal.html', {
	    scope: $scope,
	    animation: 'slide-in-up',
	    backdropClickToClose: false
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.openModal = function() {
		$scope.modal.show();
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	};

	//function to exit modal without saving matrix
	$scope.matrixClear = function(){
		$scope.modal.hide();
	}

	//function to exit modal and edit comment with save
	$scope.matrixSave = function(){
		$scope.modal.hide();
		matrixCompleted = true;
		$scope.humanSave();
	}
	
	//motorized observation button list
	$scope.motoActions = ["Passing through", "Staying in area"];
	$scope.activeVehicles = [];	
	
	//function to record motorized actions
	$scope.recordMoto = function(motoType, action, description){

		var time = new Date().toLocaleTimeString();

		//object to hold motorized vehicle properties
		var moto = {
			action: action,
			desc: description,
			time: time
		};

		if(action != 'departed'){

			//update vehicle number
			switch(motoType){
				case 'Aircraft':
					aircraftNum ++;
					moto.name = motoType + '-' +  aircraftNum;
					if($scope.aircraft.txt != undefined) $scope.aircraft.txt = '';
					break;
				case 'ATV':
					atvNum ++;
					moto.name= motoType + '-' +  atvNum;
					if($scope.atv.txt != undefined) $scope.atv.txt = '';
					break;
				case 'Boat':
					boatNum ++;
					moto.name = motoType + '-' +  boatNum;
					if($scope.motoBoat.txt != undefined) $scope.motoBoat.txt = '';
					break;
				case 'Vehicle':
					carNum ++;
					moto.name= motoType + '-' +  carNum;
					if($scope.vehicle.txt != undefined) $scope.vehicle.txt = '';
					break;
			}
			
			if (action == 'Staying in area'){
				//add to active list
				$scope.activeVehicles.push(moto);
			}

		}else{
			//remove from active list
			var index = $scope.activeVehicles.indexOf(motoType);
			moto = $scope.activeVehicles[index];
			moto.action = 'departed';
  			$scope.activeVehicles.splice(index, 1);
		}

		//update log table
		Human.motoType = moto.name;
		Human.motoAction = moto.action;
		Human.motoDesc = moto.desc;
		$scope.humanSave();

		//add to model
		$scope.moto = moto;
	};

})

.controller('environmentCtrl', function($scope, Enviro, Session, $cordovaSQLite, $ionicScrollDelegate, $ionicLoading, $timeout) {

	//global factory enviro object
	$scope.Enviro = Enviro;
	$scope.Session = Session;

	//scroll top function
    $scope.scrollDown = function(){
        $scope.showHelp = true;
        $ionicScrollDelegate.$getByHandle('enviroScroll').resize();
        $ionicScrollDelegate.$getByHandle('enviroScroll').anchorScroll(true);
        $ionicScrollDelegate.$getByHandle('enviroScroll').scrollBottom(true);
    }

    //hide help function
    $scope.hideHelp = function() {
        $scope.showHelp = false;
    }

    $scope.enviroSave = function(id){
    	// Setup the loader
		$ionicLoading.show({
			template: '<h2>Updating</h2>',
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: false,
			maxWidth: 200,
			showDelay: 0
		});
		Enviro.save(id).then(function(result){
			$timeout(function () {
				$ionicLoading.hide();
			}, 300);
		}, function(err){
			console.log("Error Found: " + err);
		});
    }

    $scope.humidSave = function(form, id){
    	if(form.$valid) {
	    	$scope.enviroSave(id);
	    }
    }
            
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

});