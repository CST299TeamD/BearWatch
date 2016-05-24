angular.module('app.controllers')

.controller('humanCtrl', function($scope, $ionicModal, Session, Human) {

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
			Human.zoneMatrix = [{zone: "+1", humans: 0}, {zone: "1", humans: 0}, {zone: "4", humans: 0}, {zone:"7", humans:0}, {zone: "7+", humans: 0}, {zone: "2+", humans: 0}, 
			{zone:"2", humans: 0}, {zone: "5", humans: 0}, {zone: "8", humans: 0}, {zone: "8+", humans: 0}, {zone: "6", humans: 0}];
			$scope.zoneImgURI = "img/estuary.png"
			break;
		case "River":
			Human.zoneMatrix = [{zone: "+1", humans: 0}, {zone: "1", humans: 0}, {zone: "4", humans: 0}, {zone:"7", humans:0}, {zone: "7+", humans: 0}, {zone: "2+", humans: 0}, 
			{zone:"2", humans: 0}, {zone: "5", humans: 0}, {zone: "8", humans: 0}, {zone: "8+", humans: 0}, {zone: "6", humans: 0}, {zone: "9", humans: 0}, {zone: "9+", humans: 0}];
			$scope.zoneImgURI = "img/river.png"
			break;
		case "Terrestrial":
			Human.zoneMatrix = [{zone: "1b", humans: 0}, {zone: "1a", humans: 0}, {zone: "4+", humans: 0}, {zone: "7a", humans: 0}, {zone: "7b", humans: 0}, {zone: "+1", humans: 0}, 
			{zone: "1", humans: 0}, {zone: "4", humans: 0}, {zone:"7", humans:0}, {zone: "7+", humans: 0}, {zone: "2+", humans: 0}, {zone:"2", humans: 0}, {zone: "5", humans: 0}, 
			{zone: "8", humans: 0}, {zone: "8+", humans: 0}, {zone: "6", humans: 0}, {zone: "9", humans: 0}, {zone: "9+", humans: 0}, {zone: "3b", humans: 0}, {zone: "3a", humans: 0}, 
			{zone: "6+", humans: 0}, {zone: "9a", humans: 0}, {zone: "9b", humans:0}];
			$scope.zoneImgURI = "img/terrestrial.png"
			break;
		default:
			$scope.zoneImgURI = "img/pic_placeholder.png"
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
	}
	
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
	};

})

.controller('environmentCtrl', function($scope, Enviro, Session, $cordovaSQLite) {
	$scope.debug = true;

	//global factory enviro object
	$scope.Enviro = Enviro;
	$scope.Session = Session;
            
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

	//logging test field
	$scope.testSelect = function(){
		$scope.insertResult = "Initialized: Session_id?:  " + Session.id;

        $cordovaSQLite.execute(db, 'SELECT * FROM logs WHERE session_id = (?)', [Session.id])
        .then(
            function(result) {
            	$scope.selectResult = "Logs = ";
                if (result.rows.length > 0) {
                	console.log("enviro results returned");
                	for (var i = 0; i < result.rows.length; i++){
	        			for(item in result.rows.item(i)){
	        				$scope.selectResult += item + ": " + result.rows.item(i)[item] + ", ";
	        			}
	        			$scope.selectResult += "   *******New Entry******   ";
	        		}
                }else{
                	console.log("No enviro results")
                }
            },
            function(error) {
                $scope.selectResult = "Error on loading: " + error.message;
            }
        );

        $cordovaSQLite.execute(db, 'SELECT * FROM food_sources WHERE session_id = (?)', [Session.id])
        .then(
            function(result) {
            	$scope.foodResult = "food sources = ";
                if (result.rows.length > 0) {
                	console.log("enviro results returned");
                	for (var i = 0; i < result.rows.length; i++){
	        			for(item in result.rows.item(i)){
	        				$scope.foodResult += item + ": " + result.rows.item(i)[item] + ", ";
	        			}
	        			$scope.foodResult += "   *******New Entry******   ";
	        		}
                }else{
                	console.log("No food source results")
                }
            },
            function(error) {
                $scope.selectResult = "Error on loading: " + error.message;
            }
        );
	}

});