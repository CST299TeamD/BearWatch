angular.module('app.controllers')

.controller('countdownController', function($scope) {
	
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {		
        countdownController();	
	}
	
	function countdownController(){
		var setTimer = function($secondsFromNow){
			var currentTime = new Date().getTime();
			var timeToAdd = $secondsFromNow * 1000;
			$scope.CountdownTimerEnd = (currentTime+timeToAdd);
			//console.log((endTime - currentTime)/60000);
			//$scope.countDown = 10;    
			var timer = setInterval(function(){
				timeRemaining($scope.CountdownTimerEnd);
			}, 1000); 

		}
		
		$scope.TimerActiveTime = 120;
		$scope.TimerRestingTime = 360;
		
		$scope.TypeOfCountdownTimer = "active";
		setTimer($scope.TimerActiveTime);
		
		var timeRemaining = function($CountdownTimerEnd){
			var seconds, minutes, hours;
			var timeLeft = $CountdownTimerEnd - (new Date().getTime());
			if (timeLeft > 0){
				
				seconds = Math.floor(timeLeft / 1000);
				minutes = Math.floor(timeLeft / (60 * 1000));
				hours = Math.floor(timeLeft / (60 * 60 * 1000));
				
				if($scope.TypeOfCountdownTimer == "active"){
					if (seconds >= 60 ) {$scope.CountdownTimerColor = 'green';}
					else if (seconds >= 10 ) {$scope.CountdownTimerColor = 'yellow';}
					else if (seconds >= 0) {$scope.CountdownTimerColor = 'red';}
					else {}
				} else {
					$scope.CountdownTimerColor = 'blue';
				}
				seconds = seconds % 60;
				minutes = minutes % 60;
				hours = hours % 60;
				
				if (seconds < 10) seconds = '0' + seconds;
				if (minutes < 10) minutes = '0' + minutes;
				if (hours < 10) hours = '0' + hours;

			} else {
				seconds = minutes = hours = '00';
				if ($scope.TypeOfCountdownTimer == "active"){
					$scope.TypeOfCountdownTimer = "resting";
					setTimer($scope.TimerRestingTime);
				} else {
					$scope.TypeOfCountdownTimer = "active";
					setTimer($scope.TimerActiveTime);
				}
			}
			$scope.CountdownTimer = (hours + ':' + minutes + ':' + seconds);				
			$scope.$apply();
			
		}
	}
});