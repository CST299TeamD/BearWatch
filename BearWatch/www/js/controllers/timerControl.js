angular.module('app.controllers')

.controller('timerControl', function($scope, Timer) {
		
	if(Timer.controllerInterval != 0) {clearInterval(Timer.controllerInterval);}
	if(Timer.endTimer == false && Timer.scanningTimer == false){return;}
	if(Timer.value == '') {Timer.Start();}

	$scope.value = Timer.value;
	$scope.color = Timer.color;
	
	
	var updateScope = function(){	
		$scope.value = Timer.value;
		$scope.color = Timer.color;
		$scope.$apply();
	}

	var controllerInterval = setInterval(function(){
		updateScope();
		if (Timer.value == '' && Timer.lastTimer == true) {clearInterval(controllerInterval);}
	}, 1000); 
	

});