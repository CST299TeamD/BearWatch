angular.module('app.services')

.factory('Timer', function() {
	
	var Timer = {
		activeTime: 30,
		restingTime: 10,
		typeOfTimer: "active",
		value: '',
		color: 'purple',
		timerInterval: 0,
		controllerInterval: 0
	};
	
	Timer.Start = function() {
		console.log('Running Timer.Start');
		if (Timer.typeOfTimer == "active"){
			Timer.setTimer(Timer.activeTime);
		} else {
			Timer.setTimer(Timer.restingTime);
		}
	}

	Timer.updateValue = function($CountdownTimerEnd){
		var seconds, minutes, hours;
		var timeLeft = $CountdownTimerEnd - (new Date().getTime());
		if (timeLeft > 0){
			
			seconds = Math.floor(timeLeft / 1000);
			minutes = Math.floor(timeLeft / (60 * 1000));
			hours = Math.floor(timeLeft / (60 * 60 * 1000));
			
			if(Timer.typeOfTimer == "active"){
				if (seconds >= 60 ) {Timer.color = 'green';}
				else if (seconds >= 10 ) {Timer.color = 'yellow';}
				else if (seconds >= 0) {Timer.color = 'red';}
				else {}
			} else {
				Timer.color = 'blue';
			}
			seconds = seconds % 60;
			minutes = minutes % 60;
			hours = hours % 60;
			
			if (seconds < 10) seconds = '0' + seconds;
			if (minutes < 10) minutes = '0' + minutes;
			if (hours < 10) hours = '0' + hours;

		} else {
			seconds = minutes = hours = '00';
			if (Timer.typeOfTimer == "active"){
				Timer.typeOfTimer = "resting";
				clearInterval(Timer.timerInterval);
				Timer.setTimer(Timer.restingTime);
			} else {
				Timer.typeOfTimer = "active";
				clearInterval(Timer.timerInterval);
				Timer.setTimer(Timer.activeTime);
			}
		}
		Timer.value = (hours + ':' + minutes + ':' + seconds);
	}
	
	Timer.setTimer = function($secondsFromNow) {
		var currentTime = new Date().getTime();
		var timeToAdd = $secondsFromNow * 1000;
		var CountdownTimerEnd = (currentTime+timeToAdd);  
		Timer.timerInterval = setInterval(function(){
			Timer.updateValue(CountdownTimerEnd);
		}, 1000); 
	
	}

	return Timer;
});