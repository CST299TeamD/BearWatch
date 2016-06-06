angular.module('app.services')

.factory('Timer', function(Session) {
	
	var Timer = {
		running: false,
		scanningTimer: false,
		activeTime: '',
		restingTime: '',
		typeOfTimer: "active",
		value: '',
		color: '',
		endTimer: false,
		endTime: '',
		lastTimer: false,
		timerInterval: 0,
		controllerInterval: 0
	};

	Timer.reset = function(){
		clearInterval(Timer.timerInterval);
		clearInterval(Timer.controllerInterval);

		Timer.running = false;
		Timer.scanningTimer = false;
		Timer.activeTime = '';
		Timer.restingTime = '';
		Timer.typeOfTimer = "active";
		Timer.value = '';
		Timer.color = '';
		Timer.endTimer = false;
		Timer.endTime = '';
		Timer.lastTimer = false;
		Timer.timerInterval = 0;
		Timer.controllerInterval = 0;		
	}

	Timer.Start = function() {
		
		if (Session.active != '' && Session.active !== null) {
			Timer.scanningTimer = true;
			Timer.activeTime = parseInt(Session.active) * 60;
			Timer.restingTime = parseInt(Session.resting) * 60;
		}
		if (Session.hr !== null || Session.min !== null) Timer.endTimer = true;
		if (Timer.endTimer){
			if (Session.hr == null) Session.hr = 0;
			if (Session.min == null) Session.min = 0;
			Timer.endTime = (new Date().getTime()) + ((((parseInt(Session.hr) * 60) + parseInt(Session.min)) * 60) * 1000);
			if (Session.active == '' || Session.active == null){
				Timer.activeTime = (((parseInt(Session.hr) * 60) + parseInt(Session.min)) * 60);
			}
		}

		Timer.running = true;

		if (Timer.typeOfTimer == "active"){	
			Timer.setTimer(Timer.activeTime);
		} else {
			Timer.setTimer(Timer.restingTime);
		}
	}

	Timer.updateValue = function($CountdownTimerEnd){
		var seconds, minutes, hours;
		var timeLeft = $CountdownTimerEnd - (new Date().getTime());
		if (timeLeft >= 1){
			
			seconds = (Math.floor(timeLeft / 1000));
			minutes = Math.floor(timeLeft / (60 * 1000));
			hours = Math.floor(timeLeft / (60 * 60 * 1000));
			
			if(Timer.typeOfTimer == "active"){
				if (seconds >= 11 ) {Timer.color = 'green';}
				else if (seconds < 11) {Timer.color = 'red';}
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
			clearInterval(Timer.timerInterval);
			if (Timer.lastTimer == true){
				Timer.value = '';

				var message = "This Session has run for ";
				if(Session.hr != ""){message = message + Session.hr + " hour";}
				if(Session.hr != "" && Session.hr != "1"){message = message + "s";}
				if(Session.hr != "" && Session.min != ""){message = message + " and ";}
				if(Session.min != ""){message = message + Session.min + " minute";}
				if(Session.min != "" && Session.min != "1"){message = message + "s";}
				message = message + ".\n Data collection will continue.";
				alert(message);
				Timer.endTimer = false;
				Timer.scanningTimer = false;
				return;
			} else if (Timer.typeOfTimer == "active"){
				Timer.typeOfTimer = "resting";
				Timer.value = (hours + ':' + minutes + ':' + seconds);
				Timer.setTimer(Timer.restingTime);
			} else {
				Timer.typeOfTimer = "active";
				Timer.value = (hours + ':' + minutes + ':' + seconds);
				Timer.setTimer(Timer.activeTime);
			}
		}
		Timer.value = (hours + ':' + minutes + ':' + seconds);
	}
	
	Timer.setTimer = function($secondsFromNow) {
		var currentTime = new Date().getTime();
		var timeToAdd = $secondsFromNow * 1000;
		var CountdownTimerEnd = (currentTime+timeToAdd);
		if (Timer.endTimer == true && CountdownTimerEnd >= Timer.endTime){
			Timer.lastTimer = true;
			CountdownTimerEnd = Timer.endTime;
		}
		Timer.updateValue(CountdownTimerEnd);
		Timer.timerInterval = setInterval(function(){
			Timer.updateValue(CountdownTimerEnd);
		}, 1000); 
	}

	return Timer;
});