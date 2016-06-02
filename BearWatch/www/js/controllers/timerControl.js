angular.module('app.controllers')

.controller('timerControl', function($scope, Timer) {

	if(Timer.controllerInterval != 0) {clearInterval(Timer.controllerInterval);}

	if(Timer.running == false) {Timer.Start();}

	if(Timer.endTimer == false && Timer.scanningTimer == false){return;}
	$scope.value = Timer.value;
	$scope.color = Timer.color;
	
	var updateScope = function(){	
		$scope.value = Timer.value;
		$scope.color = Timer.color;
		$scope.$apply();
	}

	Timer.controllerInterval = setInterval(function(){
		if (Timer.value == '' && Timer.lastTimer == true) {clearInterval(Timer.controllerInterval);}
		updateScope();
	}, 1000); 
	

});