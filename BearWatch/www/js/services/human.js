angular.module('app.services')

.factory('Human', function($cordovaSQLite, Session){
	var Human = {
		zoneMatrix: [],
		behavior: '',
		comment: '',
		nonMoto: [{type: 'Angling', checked: false}, {type: 'Boating', checked: false}, {type: 'Hiking/Walking', checked: false}, 
		{type: 'Running', checked: false}, {type: 'Picnicking', checked: false}, {type: 'Photography', checked: false}, {type: 'Playing', checked: false}, 
		{type: 'Wildlife Viewing', checked: false}, {type: 'Biking', checked: false}, {type: 'Unobservable', checked: false}, {type: 'Other', checked: false}],
		nonMotoOther: ''
	};

	//function to save human state in logs table
	Human.save = function(){

	};

	//return human object
	return Human;
});