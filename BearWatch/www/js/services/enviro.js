angular.module('app.services')

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
        console.log("Enviro Save activated! id=" + id);
        var obscurity = '';
        
        if(Enviro.obscuredReason == 'Other'){
            obscurity = Enviro.obscuredOther;
        }else{
            obscurity = Enviro.obscuredReason;
        }
        
        $cordovaSQLite.execute(db, 
            'INSERT INTO logs '
            + '(timestamp, water_body, water_level, water_flow, water_clarity, cloud_cover, precipitation, wind, wind_direction,'
            + ' temperature, humididty, visibility, obstruction, noise_level, session_id)'
            + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [time.toLocaleTimeString(), Enviro.waterBody, Enviro.waterLevel, Enviro.waterFlow, Enviro.waterClarity, Enviro.cloudCover, Enviro.precipitation, 
            Enviro.wind, Enviro.windDirection, Enviro.temp, Enviro.humid, Enviro.visibility, Enviro.obstruction, Enviro.noiseLevel, id])
        .then(function(result) {
            console.log("Enviro save success" + result.insertId);
        }, function(error) {
            console.log("Error on saving: " + error.message);
        });

        console.log("#in foodSources: " + Enviro.foodSources.length);

        for(food in Enviro.foodSources){
            console.log("food: " + JSON.stringify(Enviro.foodSources[food]));
            $cordovaSQLite.execute(db, 
                'INSERT INTO food_sources '
                + '(food_source, availability, comment, session_id)'
                + ' VALUES (?, ?, ?, ?)', 
                [ Enviro.foodSources[food].src, Enviro.foodSources[food].avail, Enviro.foodSources[food].desc, id])
            .then(function(result) {
                console.log("Food_source save success" + result.insertId);
            }, function(error) {
                console.log("Error on saving: " + error.message);
            });
        }
        
    }
    
    //return environment object
    return Enviro;

});