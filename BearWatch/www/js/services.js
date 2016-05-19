angular.module('app.services', [])

.factory('Session', function($cordovaSQLite){
    var Session =  { 
        id: '',
        observer: '',
        nameResult: [],
        park: '',
        site: '',
        viewingArea: '',
        viewingAreaOther: '',
        stationary: '',
        zoneSchema: '',
        comment: '',
        observationMode: ''
    };
    
    //function for saving session state
	Session.save = function(){      
        var success = '';
        var protocol = '';
        var time = new Date();
        if(Session.viewingArea == 'Other'){
           protocol = Session.viewingAreaOther;
        }else{
            protocol = Session.viewingArea;
        }
        
        $cordovaSQLite.execute(db, 
            'INSERT INTO sessions '
            + '(observers, park, park_site, protocol, stationary, zone_type, zone_comment, start_time, observation_mode)'
            + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [Session.nameResult.toString(), Session.site, protocol, Session.stationary, Session.zoneSchema, Session.comment, 
            time.toLocaleTimeString(), Session.observationMode])
        .then(function(result) {
            console.log("Session save success" + result.insertId);            
			success = "Session save success" + result.insertId;
            Session.id = result.insertId;
        }, function(error) {
            return "Error on saving: " + error.message;
        });
        
        $cordovaSQLite.execute(db, 'SELECT last_insert_rowid')
        .then(function(result) {
            if (result.rows.length > 0) {
                console.log("last_insert_rowid: " + JSON.stringify(result));
                console.log("result.rows.item(0).session_id: " + result.rows.item(0).session_id);
                Session.id = result.rows.item(0).session_id;
            }
        }, function(error) {
            return "Error on getting rowid: " + error.message;
        });
        return success;
    }
    
    //return session object
    return Session;

})

.factory('Enviro', function($cordovaSQLite){
    
    //food id index
	var food_id = 0;
	
    //time var for timestamp
    var time = new Date();
    
    var Enviro =  { 
        session_id: '',
        waterBody: '',
        waterLevel: '',
        waterFlow: '',
        waterClarity: '',
        cloudCover: '',
        precipitation: '',
        wind: '',
        windDirection: '',
        temp: '',
        humid: '',
        visibility: '',
        obscuredReason: '',
        obscuredOther: '',
        noiseLevel: '',
        foodSource: '',
        foodSourceAvail: '',
        foodSourceComment: '',
        foodSources: []
    };
    
	
	//function for adding food sources
	Enviro.addFood = function(){
        if(Enviro.foodSource != ''){
                               
            //create new food object
            var food = {};
            food.id = food_id;
            food.src = Enviro.foodSource;
            food.avail = Enviro.foodSourceAvail;
            food.desc = Enviro.foodSourceComment;
            food.added = time.toLocaleTimeString();
            
            //add to array
            Enviro.foodSources.push(food);
            food_id += 1;
            
            //clear form inputs (model)
            Enviro.foodSource = '';
            Enviro.foodSourceAvail = '';
            Enviro.foodSourceComment = '';
        }				
	};
	
	//function to clear observer name from list
	Enviro.clearFood = function (id){
		var index = -1;
		for(i = 0; i < Enviro.foodSources.length; i++) {
			if (Enviro.foodSources[i].id == id) {
				index = i;
				break;
			}
		}
		if(index > -1){
			Enviro.foodSources.splice(index, 1);
		} 
	};
    
    //function for saving environment state
	Enviro.save = function(id){      
        var success = '';
        var obscurity = '';
        
        if(Enviro.obscuredReason == 'Other'){
            obscurity = Enviro.obscuredOther;
        }else{
            obscurity = Enviro.obscuredReason;
        }
        
        $cordovaSQLite.execute(db, 
            'INSERT INTO logs '
            + '(water_body, water_level, water_flow, water_clarity, cloud_cover, precipitation, wind, wind_direction, temperature, humididty, visibility, noise_level, session_id)'
            + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [Session.nameResult.toString(), Session.site, protocol, Session.stationary, Session.zoneSchema, Session.comment, 
            time.toLocaleTimeString(), Session.observationMode])
        .then(function(result) {
            console.log("Session save success" + result.insertId);            
			success = "Session save success" + result.insertId;
        }, function(error) {
            return "Error on saving: " + error.message;
        });
        
        $cordovaSQLite.execute(db, 'SELECT last_insert_rowid')
        .then(function(result) {
            if (result.rows.length > 0) {
                console.log("last_insert_rowid: " + JSON.stringify(result));
                console.log("result.rows.item(0).session_id: " + result.rows.item(0).session_id);
                Session.id = result.rows.item(0).session_id;
            }
        }, function(error) {
            return "Error on getting rowid: " + error.message;
        });
        return success;
    }
    
    //return environment object
    return Enviro;

})

.factory('DB', function($cordovaSQLite, $ionicPlatform){
    //TODO: port DB functionality to service module
});
