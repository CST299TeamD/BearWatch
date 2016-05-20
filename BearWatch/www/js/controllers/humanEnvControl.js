angular.module('app.controllers')

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

});