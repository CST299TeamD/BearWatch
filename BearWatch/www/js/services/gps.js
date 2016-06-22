angular.module('app.services')

.factory('GPS', function($cordovaGeolocation, Session){
	
    var GPS =  { 
		errorCode: '',
		errorMessage: '',
        easting: '',
        northing: '',
        utmZone: ''
    };
    
	//refresh the GPS data at regular intervals
	GPS.refresher = function(){
		var timerLength = 30; //interval in seconds
		var timer = setInterval(function(){
			if(Session.stationary=='Mobile'){
				GPS.refresh();
			}
		}, timerLength * 1000); 
	}
	
	//GPS.refresh updates the GPS data
    GPS.refresh = function(){
		function onSuccess(position) {	
			LatLngToUTMRef(position.coords.latitude, position.coords.longitude, function(UTMEasting, UTMNorthing, UTMZone){
				GPS.errorMessage = '';
				GPS.errorCode = '';
				GPS.easting = UTMEasting;	
				GPS.northing = UTMNorthing;	
				GPS.utmZone = UTMZone;	
			});				
		}

		function onError(error) {
			GPS.errorMessage = error.code;
			GPS.errorMessage = error.message;
			GPS.easting = '';	
			GPS.northing = '';	
			GPS.utmZone = '';
		}

		navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true, timeout: (30 * 1000), maximumAge: 0});
    }
	
	GPS.refresh();
	return GPS;

});