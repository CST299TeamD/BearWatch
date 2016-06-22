angular.module('app.services')

.factory('Human', function($cordovaSQLite, Session, GPS, $q){
	var Human = {
		zoneMatrix: [],
		behavior: '',
		comment: '',
		nonMoto: [{type: 'Angling', checked: false}, {type: 'Boating', checked: false}, {type: 'Hiking/Walking', checked: false}, 
		{type: 'Running', checked: false}, {type: 'Picnicking', checked: false}, {type: 'Photography', checked: false}, {type: 'Playing', checked: false}, 
		{type: 'Wildlife Viewing', checked: false}, {type: 'Biking', checked: false}, {type: 'Unobservable', checked: false}, {type: 'Other', checked: false}],
		nonMotoOther: '',
		motoType: '',
		motoAction: '',
		motoDesc: ''
	};

	//function to reset Human object
	Human.reset = function(){
		Human.zoneMatrix = [];
		Human.behavior = '';
		Human.comment = '';
		Human.nonMoto = [{type: 'Angling', checked: false}, {type: 'Boating', checked: false}, {type: 'Hiking/Walking', checked: false}, 
		{type: 'Running', checked: false}, {type: 'Picnicking', checked: false}, {type: 'Photography', checked: false}, {type: 'Playing', checked: false}, 
		{type: 'Wildlife Viewing', checked: false}, {type: 'Biking', checked: false}, {type: 'Unobservable', checked: false}, {type: 'Other', checked: false}];
		Human.nonMotoOther = '';
		Human.motoType = '';
		Human.motoAction = '';
		Human.motoDesc = '';
	};

	//function to save human state in logs table
	Human.save = function(){
		var defer = $q.defer();

		$cordovaSQLite.execute(db, 
            'INSERT INTO logs '
            + '(timestamp, session_id, human_count, motorized_name, motorized_action, motorized_desc, human_type, human_other, human_behavior,'
            + ' comment_type, comment, utm_zone, northing, easting)'
            + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [new Date(), Session.id, JSON.stringify(Human.zoneMatrix), Human.motoType, Human.motoAction, Human.motoDesc, 
            JSON.stringify(Human.nonMoto), Human.nonMotoOther, Human.behavior, 'Human', Human.comment, GPS.utmZone, GPS.northing, GPS.easting])
        .then(function(result) {
            Human.comment = '';
            Human.motoType = '';
            Human.motoAction = '';
            Human.motoDesc = '';
            defer.resolve(result);
        }, function(error) {
            console.log("Error Found: " + error);
            defer.reject(error);
        });
        return defer.promise;
	};

	//return human object
	return Human;
});