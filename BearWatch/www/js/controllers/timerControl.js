angular.module('app.controllers')

.controller('timerControl', function($scope, Timer) {
		
	if(Timer.value == '') {Timer.Start();}
	if(Timer.controllerInterval != 0) {clearInterval(Timer.controllerInterval);}
	$scope.value = Timer.value;
	$scope.color = Timer.color;
	
	
	var updateScope = function(){	
		$scope.value = Timer.value;
		$scope.color = Timer.color;
		$scope.$apply();
	}

	Timer.controllerInterval = setInterval(function(){		
		updateScope();
	}, 1000); 
	

});