angular.module('app.services')

.factory('Human', function($cordovaSQLite, Session){
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

	//function to save human state in logs table
	Human.save = function(){
		$cordovaSQLite.execute(db, 
            'INSERT INTO logs '
            + '(timestamp, session_id, human_count, motorized_name, motorized_action, motorized_desc, human_type, human_other, human_behavior, comment_type, comment)'
            + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [new Date().toLocaleTimeString(), Session.id, JSON.stringify(Human.zoneMatrix), Human.motoType, Human.motoAction, Human.motoDesc, 
            JSON.stringify(Human.nonMoto), Human.nonMotoOther, Human.behavior, 'Human Comment', Human.comment])
        .then(function(result) {
            console.log("Human save success" + result.insertId);
            Human.comment = '';
        	Human.behavior = '';
        }, function(error) {
            console.log("Error on saving Human: " + error.message);
        });
	};

	//return human object
	return Human;
});