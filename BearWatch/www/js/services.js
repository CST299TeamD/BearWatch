angular.module('app.services', [])

.factory('Bear', [function(){
                     return {
                     bearName: '',
                     bearZone: '',
                     bearSize: '',
                     bearAge: '',
                     bearGender: '',
                     bearSpecies: '',
                     markDescription: '',
                     bearFurColour: '',
                     bearPawMeasered: '',
                     bearCubs: '',
                     bearCubFurColour: '',
                     bearCubAge: '',
                     bearbehaviour: [],
                     bearComment: ''
                     };
                     
                     }])

.factory('Session', [function(){
    return { 
        observer: '',
        nameResult: [],
        park: '',
        site: '',
        viewingArea: '',
        viewingAreaOther: '',
        stationary: '',
        zoneSchema: '',
        comment: ''
    };

}])

.factory('Enviro', [function(){
    //food id index
	var food_id = 0;
		
    var Enviro =  { 
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
            //time var for timestamp
            var time = new Date();
                    
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
    
    return Enviro;

}]);
