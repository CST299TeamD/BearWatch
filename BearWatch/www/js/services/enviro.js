angular.module('app.services')

.factory('Enviro', function($cordovaSQLite, $q, GPS){
    
    //Object properties
    var Enviro =  { 
        session_id: '',
        waterLevel: '',
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

    //function to reset enviro object
    Enviro.reset = function(){
        Enviro.session_id = '';
        Enviro.waterLevel = '';
        Enviro.waterClarity = '';
        Enviro.cloudCover = '';
        Enviro.precipitation = '';
        Enviro.wind = '';
        Enviro.windDirection = '';
        Enviro.temp = '';
        Enviro.humid = '';
        Enviro.visibility = '';
        Enviro.obscuredReason = '';
        Enviro.obscuredOther = '';
        Enviro.noiseLevel = '';
        Enviro.foodSource = '';
        Enviro.foodSourceAvail = '';
        Enviro.foodSourceComment = '';
        Enviro.foodSources = [];
    };
    
    //function for adding food sources
    Enviro.addFood = function(id){
        if(Enviro.foodSource != ''){
                               
            //create new food object
            var food = {};
            food.id = '';
            food.src = Enviro.foodSource;
            food.avail = Enviro.foodSourceAvail;
            food.desc = Enviro.foodSourceComment;
            food.added = new Date().toLocaleTimeString();
            
            //add to array
            Enviro.foodSources.push(food);
            
            //clear form inputs (model)
            Enviro.foodSource = '';
            Enviro.foodSourceAvail = '';
            Enviro.foodSourceComment = '';

            //save state if id is known (envTab)
            if(id != '' && id != null){
                Enviro.save(id);
            }
        }               
    };
    
    //function to clear food source from DB
    Enviro.clearFood = function (id, session){
        //remove from DB
        $cordovaSQLite.execute(db, 'DELETE FROM food_sources WHERE food_source_id = (?)', [id])
        .then(
            function(result) {
                //console.log(result);
            },
            function(error) {
                console.log("Error Found: " + error);
            }
        );

        //remove from Enviro object
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
        //save state if in dashboard
        if(session != '' && session != null){
            Enviro.save();
        }

    };
    
    //function for saving environment state
    Enviro.save = function(id){ 
        //session must be comeplete before saving environment info
        var defer = $q.defer();

        if(id != ''){
           
            $cordovaSQLite.execute(db, 
                'INSERT INTO logs '
                + '(timestamp, water_level, water_clarity, cloud_cover, precipitation, wind, wind_direction,'
                + ' temperature, humididty, visibility, obstruction, obstr_desc, noise_level, session_id, utm_zone, northing, easting)'
                + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [new Date(), Enviro.waterLevel, Enviro.waterClarity, Enviro.cloudCover, Enviro.precipitation, 
                Enviro.wind, Enviro.windDirection, Enviro.temp, Enviro.humid, Enviro.visibility, Enviro.obscuredReason, Enviro.obscuredOther, 
                Enviro.noiseLevel, id, GPS.utmZone, GPS.northing, GPS.easting])
            .then(function(result) {
                defer.resolve(result);
            }, function(error) {
                console.log("Error Found: " + error);
                defer.reject(error);
            });

            for(var i=0; i < Enviro.foodSources.length; i++){ 
                if(Enviro.foodSources[i].id == '' ){
                    Enviro.saveFood(id, i)
                }
            }
        }else{
            defer.reject("Session Id Required to Save Enviro Object");
        }
        return defer.promise;        
    };

    //function to save food source and give db object
    Enviro.saveFood = function(id, i){
        $cordovaSQLite.execute(db, 
            'INSERT INTO food_sources '
            + '(food_source, availability, comment, session_id)'
            + ' VALUES (?, ?, ?, ?)', 
            [ Enviro.foodSources[i].src, Enviro.foodSources[i].avail, Enviro.foodSources[i].desc, id])
        .then(function(result) {
            Enviro.foodSources[i].id = result.insertId;
        }, function(error) {
            console.log("Error Found: " + error);
        });
    }
    
    //return environment object
    return Enviro;

});