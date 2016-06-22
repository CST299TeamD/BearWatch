angular.module('app.services')

.factory('Session', function($cordovaSQLite, $q){
    var Session =  { 
        id: '',
        firstName: '',
		allNames: '',
        firstNameInitials: '',
		allNamesInitials: '',
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
		finish_time: '',
        hr: '',
        min: '',
        active: '',
        resting: '',
        altMedia: '',
		
		water_level: '',
		water_clarity: '',
		
		cloud_cover: '',
		precipitation: '',
		wind: '',
		wind_direction: '',
		temperature: '',
		humididty: '',
		noise_level: '',
		visibility: '',
		obstruction: '',
		
		humans: {
			"1b" : "",	"1a" : "", "4+" : "", "7a" : "", "7b" : "", "1+" : "", "1" : "", "4" : "", "7" : "", "7+" : "", "2+" : "", "2" : "", "5" : "", "8" : "", "8+" : "", "3+" : "", "3" : "", "6" : "", "9" : "", "9+" : "", "3b" : "", "3a" : "", "6+" : "", "9a" : "", "9b" : ""
		},
		humanType: {
			'Angling':'No', 'Boating':'No', 'Hiking/Walking':'No', 'Running':'No', 'Picnicking':'No', 'Photography':'No', 'Playing':'No', 'Wildlife Viewing':'No', 'Biking':'No', 'Unobservable':'No', 'Other':'No'
		},
		
		logs: [],
		pictures: [],
		foodSources: [],
		sessionReady: 0,
		logsReady: 0,
		foodReady: 0,
		maxFoodSources: 3,
		maxBears: 10,
		
		emailSubject: '',
		emailBody: ''
    };

    //function to reset session
    Session.reset = function(){
		Session.id = '';
        Session.firstName = '';
		Session.allNames = '';
        Session.firstNameInitials = '';
		Session.allNamesInitials = '';
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
		Session.finish_time = '';
        Session.hr = '';
        Session.min = '';
        Session.active = '';
        Session.resting = '';
        Session.altMedia = '';
		
		Session.water_level = '';
		Session.water_clarity = '';
		
		Session.cloud_cover = '';
		Session.precipitation = '';
		Session.wind = '';
		Session.wind_direction = '';
		Session.temperature = '';
		Session.humididty = '';
		Session.noise_level = '';
		Session.visibility = '';
		Session.obstruction = '';
		
		Session.humans = {
			"1b" : "",	"1a" : "", "4+" : "", "7a" : "", "7b" : "", "1+" : "", "1" : "", "4" : "", "7" : "", "7+" : "", "2+" : "", "2" : "", "5" : "", "8" : "", "8+" : "", "3+" : "", "3" : "", "6" : "", "9" : "", "9+" : "", "3b" : "", "3a" : "", "6+" : "", "9a" : "", "9b" : ""
		};
		
		Session.humanType = {
			'Angling':'No', 'Boating':'No', 'Hiking/Walking':'No', 'Running':'No', 'Picnicking':'No', 'Photography':'No', 'Playing':'No', 'Wildlife Viewing':'No', 'Biking':'No', 'Unobservable':'No', 'Other':'No'
		};
		
		Session.logs = [];
		Session.pictures = [];
		Session.foodSources = [];
		Session.sessionReady = 0;
		Session.logsReady = 0;
		Session.foodReady = 0;
	}
    
    //function for saving session state
    Session.save = function(){      
        var protocol = '';
        if (Session.viewingArea == 'Other'){
           protocol = Session.viewingAreaOther;
        } else {
            protocol = Session.viewingArea;
        }

        var defer = $q.defer();
        var time = new Date();
        Session.start_time = time;
                  
        $cordovaSQLite.execute(db, 
            'INSERT INTO sessions '
            + '(observers, park, park_site, protocol, stationary, zone_type, observer_zone, zone_comment, start_time, observation_mode, survey_sched, alt_media, active_time, resting_time)'
            + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [Session.nameResult.toString(), Session.park, Session.site, protocol, Session.stationary, Session.zoneSchema, 
            Session.obsArea, Session.comment, time, Session.observationMode, Session.surveySched, Session.altMedia, Session.active, Session.resting])
        .then(function(result) {
            defer.resolve(result);            
            Session.id = result.insertId;
        }, function(error) {
            console.log("Error Found: " + error);
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
						Session.firstName = (observers.split(","))[0];
						Session.allNames = observers;
						Session.nameResult = [];
						if(park != null)Session.park = park;
						if(park_site != null)Session.site = park_site;
						if(observer_zone != null)Session.obsArea = observer_zone;
						if(protocol != null)Session.viewingArea = protocol;
						if(stationary != null)Session.stationary = stationary;
						if(zone_type != null)Session.zoneSchema = zone_type;
						if(zone_comment != null)Session.comment = zone_comment;
						if(survey_sched != null)Session.surveySched = survey_sched;
						if(observation_mode != null)Session.observationMode = observation_mode;
						if(alt_media != null) Session.altMedia = alt_media;
						Session.start_time = new Date(start_time).toLocaleTimeString();
						Session.start_date = new Date(start_time).toLocaleDateString();
						Session.finish_time = new Date(finish_time).toLocaleTimeString();
						if(active_time != null) Session.active = active_time;
						if(resting_time != null) Session.resting = resting_time;
						Session.loadLogs();
						Session.loadFoodSources();
						
						var allObservers;
						allObservers = observers.split(",");
						Session.firstNameInitials = allObservers[0].split(" ")[0].slice(0,1) +
													" " + 
													allObservers[0].split(" ")[1].slice(0,1);
						Session.allNamesInitials = "";
						for (var i = 0; i < allObservers.length; i++){
							
							Session.allNamesInitials = Session.allNamesInitials + allObservers[i].split(" ")[0].slice(0,1) + 
							" " + 
							allObservers[i].split(" ")[1].slice(0,1);
							
							if (i+1 < allObservers.length){
								Session.allNamesInitials = Session.allNamesInitials + ", ";
							}
						}
					}
					Session.sessionReady = 1;
                }
            },
            function(error) {
                console.log("Error Found: " + error);
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
						with (result.rows.item(i)){
							Session.foodSources.push({"food_source":food_source,"availability":availability,"comment":comment});
						}
	        		}
                }	

				while (Session.foodSources.length <= Session.maxFoodSources){
					Session.foodSources.push({"food_source":"","availability":"","comment":""});
				}				
				Session.foodReady = 1;
            },
            function(error) {
                console.log("Error Found: " + error);
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
					Session.logsReady = 1;
                }
            },
            function(error) {
                console.log("Error Found: " + error);
            }
        );
	}
	
    //return session object
    return Session;

	
});