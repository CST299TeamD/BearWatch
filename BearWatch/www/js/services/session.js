angular.module('app.services')

.factory('Session', function($cordovaSQLite, $q){
    var Session =  { 
        id: '',
        firstName: '',
        lastName: '',
        nameResult: [],
        park: '',
        site: '',
        viewingArea: '',
        viewingAreaOther: '',
        stationary: '',
        zoneSchema: '',
        obsArea: '',
        comment: '',
        observationMode: '',
        surveySched: '',
        start_time: '',
        hr: '',
        min: '',
        active: '',
        resting: '',
		logs: [],
		pictures: [],
		foodSources: [],
		ready: ''
    };

    //function to reset session
    Session.reset = function(){
        Session.id = '';
        Session.firstName = '';
        Session.lastName = '';
        Session.nameResult = [];
        Session.park = '';
        Session.site = '';
        Session.viewingArea = '';
        Session.viewingAreaOther = '';
        Session.stationary = '';
        Session.zoneSchema = '';
        Session.obsArea = '';
        Session.comment = '';
        Session.observationMode = '';
        Session.surveySched = '';
        Session.start_time = '';
        Session.hr = '';
        Session.min = '';
        Session.active = '';
        Session.resting = '';
    }
    
    //function for saving session state
    Session.save = function(){      
        var protocol = '';
        if(Session.viewingArea == 'Other'){
           protocol = Session.viewingAreaOther;
        }else{
            protocol = Session.viewingArea;
        }

        var defer = $q.defer();
        var time = new Date();
        Session.start_time = time;
                  
        $cordovaSQLite.execute(db, 
            'INSERT INTO sessions '
            + '(observers, park, park_site, protocol, stationary, zone_type, observer_zone, zone_comment, start_time, observation_mode, survey_shed)'
            + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [Session.nameResult.toString(), Session.park, Session.site, protocol, Session.stationary, Session.zoneSchema, 
            Session.obsArea, Session.comment, time, Session.observationMode, Session.surveySched])
        .then(function(result) {
            console.log("Session save success" + result.insertId);
            defer.resolve(result);            
            Session.id = result.insertId;
        }, function(error) {
            console.log("Error on saving: " + error.message);
            defer.reject(error);
        });
        return defer.promise;
    }
    
	Session.load = function(id){
		$cordovaSQLite.execute(db, 'SELECT * FROM sessions WHERE session_id = (?)', [id])
        .then(
            function(result) {
            	if (result.rows.length > 0) {
					with(result.rows.item(0)){
						Session.id = session_id;
						Session.firstName = observers; //TDL - why are we storing firstname/lastname as a single field?
						Session.lastName = '';
						Session.nameResult = [];
						Session.park = park;
						Session.park_site = '';
						Session.viewingArea = protocol;
						Session.viewingAreaOther = '';
						Session.stationary = stationary;
						Session.zoneSchema = zone_type;
						Session.comment = zone_comment;
						Session.observationMode = observation_mode;
						Session.start_time = new Date(start_time).toLocaleTimeString();
						console.log("Session Start Time: " + Session.start_time);
						Session.start_date = new Date(start_time).toLocaleDateString();
						console.log("Session Start Date: " + Session.start_date); 
						Session.hr = '';
						Session.min = '';
						Session.active = '';
						Session.resting = '';
						Session.loadLogs();
						Session.loadFoodSources();
					}
                }else{
                	console.log("No sessions found")
                }
            },
            function(error) {
                $scope.selectResult = "Error on loading: " + error.message;
            }
        );
	}
	
	Session.loadFoodSources = function() {
		Session.foodSources = [];
		$cordovaSQLite.execute(db, 'SELECT * FROM food_sources WHERE session_id = (?)', [Session.id])
        .then(
            function(result) {
				if (result.rows.length > 0) {
                	for (var i = 0; i < result.rows.length; i++){
						Session.foodSources.push(result.rows.item(i));	
	        		}
					console.log("Food sources added to session object");
                }else{
                	console.log("No logs for this session")
                }
            },
            function(error) {
                alert("Error on loading: " + error.message);
            }
        );
	}
	
	Session.loadLogs = function(){
		Session.logs = [];
		
		$cordovaSQLite.execute(db, 'SELECT * FROM logs WHERE session_id = (?)', [Session.id])
        .then(
            function(result) {
                if (result.rows.length > 0) {
                	for (var i = 0; i < result.rows.length; i++){
						Session.logs.push(result.rows.item(i));	
	        		}
					console.log("Logs added to session object");
					Session.ready = 1;
                }else{
                	console.log("No logs for this session")
                }
            },
            function(error) {
                alert("Error on loading: " + error.message);
            }
        );
	}
	
    //return session object
    return Session;

	
});