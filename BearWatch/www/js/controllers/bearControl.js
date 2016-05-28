angular.module('app.controllers')

.controller('bearCtrl', function($scope, $cordovaSQLite, BearList, Bear, $location, Session) {
	
    //get the factory objects
	$scope.BearList = BearList;
	$scope.Bear = Bear;
    $scope.Session = Session;
	
            
    //change bear as per selection of user
    $scope.changeBear = function(index){

        // pull the bear object from the array
		var tmp = $scope.BearList.add[index];
        
        $scope.Bear.index = tmp.index;
        $scope.Bear.id = tmp.id;
	    $scope.Bear.isFocal = tmp.isFocal;
		$scope.Bear.name = tmp.name;
		$scope.Bear.zone = tmp.zone;
		$scope.Bear.size = tmp.size;
		$scope.Bear.age = tmp.age;
		$scope.Bear.gender = tmp.gender;
		$scope.Bear.species = tmp.species;
		$scope.Bear.markDescription = tmp.markDescription;
		$scope.Bear.furColour = tmp.furColour;
		$scope.Bear.pawMeasured = tmp.pawMeasured;
		$scope.Bear.cubs = tmp.cubs;
		$scope.Bear.cubFurColour = tmp.cubFurColour;
		$scope.Bear.cubAge = tmp.cubAge;
		$scope.Bear.behaviour = tmp.behaviour;
        $scope.Bear.fishing = tmp.fishing;
        
        //try to get fishing behaviours
        try{
            $scope.Bear.fishingMethod = tmp.fishing[tmp.fishing.length -1].method;
            $scope.Bear.fishingSuboption = tmp.fishing[tmp.fishing.length -1].suboption;
            $scope.Bear.tally = tmp.fishing[tmp.fishing.length -1].tally;
        } catch(err) {
            $scope.Bear.fishingMethod = '';
            $scope.Bear.fishingSuboption = '';
            $scope.Bear.tally = 0;

        }
            //debug stuff
        /*    console.log($scope.Bear.index + " index \n " +
                        $scope.Bear.id + " id \n" +
                        $scope.Bear.isFocal + " isFocal \n" +
                        $scope.Bear.name + " name \n" +
                        $scope.Bear.zone + " zone \n" +
                        $scope.Bear.size + " size \n" +
                        $scope.Bear.age + " age \n " +
                        $scope.Bear.gender + " gender \n" +
                        $scope.Bear.species + " species \n" +
                        $scope.Bear.markDescription + " markdescription \n " +
                        $scope.Bear.furColour + " furcolour \n" +
                        $scope.Bear.pawMeasured + " pawmesured \n" +
                        $scope.Bear.cubs + " cubs \n" +
                        $scope.Bear.cubFurColour + " cubFurcolour \n" +
                        $scope.Bear.cubAge + "cubAge \n" +
                        $scope.Bear.isFishing + " isFishing \n" +
                        $scope.Bear.comment + " comment \n"
                        ); */
        $scope.Bear.comment = tmp.comment;
	
    }
})

.controller('addBearCtrl', function($scope, $cordovaSQLite, Bear, BearList, Session, FBearSet, $ionicPopup, $location, $state) {
	//global debug var
	$scope.debug = debug;

	//get the factory objects
	$scope.Session = Session;
    $scope.Bear = Bear;
    $scope.BearList = BearList;
    $scope.FBearSet = FBearSet;

    //clear the bear object
    $scope.Bear.index = -1;
    $scope.Bear.id = -1;
    $scope.Bear.isFocal = '';
    $scope.Bear.name = '';
    $scope.Bear.zone = '';
    $scope.Bear.size = '';
    $scope.Bear.age = '';
    $scope.Bear.gender = '';
    $scope.Bear.species = '';
    $scope.Bear.markDescription = '';
    $scope.Bear.furColour = '';
    $scope.Bear.pawMeasured = false;
    $scope.Bear.cubs = '';
    $scope.Bear.cubFurColour = '';
    $scope.Bear.cubAge = '';
    $scope.Bear.behaviour = [];
    $scope.Bear.isFishing = false;
    $scope.Bear.fishing = [];
    $scope.Bear.fishingMethod = '';
    $scope.Bear.fishingSuboption = '';
    $scope.Bear.tally = 0;
    $scope.Bear.comment = '';
            
   	var sIdInsertResult = "Not Initialized";
	var bearInsertResult = "Not Initialized";
	$scope.bearInsertResult = bearInsertResult;
	$scope.sIdInsertResult = sIdInsertResult;

	//add bear to fake session id - to be updated
	$scope.addBear = function(){
        var validated = false;
        var duplicate = false;


        //Autogenrating the bear name
        if ($scope.Bear.name == '') {
            $scope.Bear.name = "Bear " + (BearList.add.length + 1);
        }
        
        if ($scope.Bear.isFocal == true) {
            $scope.Bear.name += " (Focal Bear)";
        }

        //check for duplicative name
        for(var n = 0; n < $scope.BearList.add.length; n++) {
            if($scope.BearList.add[n].name == $scope.Bear.name) {
                duplicate = true;
                var alertPopup = $ionicPopup.alert({
                    title: 'Duplicate Bear!',
                    template: 'There is another bear named '+ $scope.BearList.add[n].name +' in this session' 
                });
                 alertPopup.then(function(res) {
                    return;
                });
    
            }
        }


        
        if(duplicate == false) {
    		//insert into bears table
    		$cordovaSQLite.execute(db, 'INSERT INTO bears (bear_name, bear_location, size, age, gender, species, '
    								  +'mark_desc, fur_colour, paw_measure, cubs, cub_fur, cub_age, comment, '
    								  +	'session_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    									[$scope.Bear.name, $scope.Bear.zone, $scope.Bear.size, $scope.Bear.age, $scope.Bear.gender,
    									$scope.Bear.species, $scope.Bear.markDescription, $scope.Bear.furColour, $scope.Bear.pawMeasered,
    									$scope.Bear.cubs, $scope.Bear.cubFurColour, $scope.Bear.cubAge, $scope.bearComment, $scope.session_id])
    	    	.then(function(result) {
        	    	$scope.bearInsertResult = "Bear inserted";
                    
                    //set there is a focal bear in the session
                    if($scope.FBearSet.isFocalPresent == '' && $scope.Bear.isFocal == true) {
                        $scope.FBearSet.isFocalPresent = true;
                    }
                    
                    //if session is scanning all bears are focal
                    if($scope.Session.observationMode == "Scanning"){
                        $scope.Bear.isFocal = true;
                    }
                      
                    //store the bear object in the session array
        	    	$scope.BearList.add.push({
        	    		index: $scope.BearList.add.length,
        	    		id: result.insertId,
                        isFocal: $scope.Bear.isFocal,
        	    		name: $scope.Bear.name,
        	    		zone: $scope.Bear.zone,
        	    		size: $scope.Bear.size,
        	    		age: $scope.Bear.age,
        	    		gender: $scope.Bear.gender,
        	    		species: $scope.Bear.species,
        	    		markDescription: $scope.Bear.markDescription,
                        furColour: $scope.Bear.furColour,
                        pawMeasured: $scope.Bear.pawMeasured,
        	    		cubs: $scope.Bear.cubs,
        	    		cubFurColour: $scope.Bear.cubFurColour,
        	    		cubAge: $scope.Bear.cubAge,
                        behaviour: [],
                        isFishing: false,
                        fishing: [],
                        fishingMethod: '',
                        fishingSuboption: '',
                        tally: 0,
        	    		comment: $scope.Bear.comment
        	    	});
                      
                    //debug stuff
                   /* console.log($scope.BearList.add[$scope.BearList.add.length - 1].index + " index \n " +
                                $scope.BearList.add[$scope.BearList.add.length - 1].id + " id \n" +
                                $scope.BearList.add[$scope.BearList.add.length - 1].isFocal + " isFocal \n" +
                                $scope.BearList.add[$scope.BearList.add.length - 1].name + " name \n" +
                                $scope.BearList.add[$scope.BearList.add.length - 1].zone + " zone \n" +
                                $scope.BearList.add[$scope.BearList.add.length - 1].size + " size \n" +
                                $scope.BearList.add[$scope.BearList.add.length - 1].age + " age \n " +
                                $scope.BearList.add[$scope.BearList.add.length - 1].gender + " gender \n" +
                                $scope.BearList.add[$scope.BearList.add.length - 1].species + " species \n" +
                                $scope.BearList.add[$scope.BearList.add.length - 1].markDescription + " markdescription \n " +
                                $scope.BearList.add[$scope.BearList.add.length - 1].furColour + " furcolour \n" +
                                $scope.BearList.add[$scope.BearList.add.length - 1].pawMeasured + " pawmesured \n" +
                                $scope.BearList.add[$scope.BearList.add.length - 1].cubs + " cubs \n" +
                                $scope.BearList.add[$scope.BearList.add.length - 1].cubFurColour + " cubFurcolour \n" +
                                $scope.BearList.add[$scope.BearList.add.length - 1].cubAge + "cubAge \n" +
                                $scope.BearList.add[$scope.BearList.add.length - 1].isFishing + " isFishing \n" +
                                $scope.BearList.add[$scope.BearList.add.length - 1].comment + " comment \n"
                                );*/
                            
        		}, function(error) {
           	 		$scope.bearInsertResult = "Error on inserting Bear: " + error.message;
        		})
            //change page location
            $location.path("tab.bear");
            $state.go("tab.bear");
        }
	} //end of add bear function


   	var numret = 0;
   	$scope.numret = numret;
   	//select example
    $scope.testSessionId = function() {
    	$scope.result = "Initialized";
		// Execute SELECT statement to load message from database.
        $cordovaSQLite.execute(db, 'SELECT bear_name FROM bears WHERE session_id = ?', [1])
            .then(
                function(result) {
                	$scope.result = "Result Positive but no rows";
                	$scope.rows = result.rows.length;
             	  	$scope.numret = result.rows.length;
                    if (result.rows.length > 0) {

                        $scope.status = result.rows.item(0).bear_name;
                        $scope.result = "Data in bear table - " + $scope.status;
                    }
                },
                function(error) {
                    $scope.result = "Error on loading: " + error.message;
                }
            );
    }
})


.controller('bearInfoCtrl', function($scope, Bear, BearList, Session) {
            $scope.Session = Session;
            $scope.session_id = Session.id;
            $scope.Bear = Bear;
            $scope.BearList = BearList; 

            
            var feeding = ["Pursuit for food", "Green Vegetation", "Berries", "Human Food"];
            var nonInteractive = ["Loafing/Resting", "Sleeping", "Walking", "Running"];
            var bBInteraction =["Alert/Vigilance", "Playing", "Fighting", "Defense"];
            var bHInteraction = ["Alert/Vigilance", "Retreat", "Bear Approach"];
            var hBinteraction = ["Alert/Vigilance", "Retreat", "Approach Bear", "Aggression "];
            var habituationLevel = ["Habituated", "Non- Habituated", "Sub-Adult"];
            
            $scope.feeding = feeding;
            $scope.nonInteractive = nonInteractive;
            $scope.bBInteraction = bBInteraction;
            $scope.bHInteraction = bHInteraction;
            $scope.hBinteraction = hBinteraction;
            $scope.habituationLevel = habituationLevel;

            //fishing activity
            $scope.onFishing = function(){
                //turn off other feeding and foraging
                for(var n = 0; n < $scope.Bear.behaviour.length; n++) {
                    if($scope.Bear.behaviour[n].category == "Feeding or Foraging") {
                            $scope.Bear.behaviour.splice(n, 1);
                    }
                }
                $scope.Bear.isFishing = !($scope.Bear.isFishing);
                if($scope.Bear.isFishing == true) {
                    var curTime = new Date().toLocaleTimeString();
                    $scope.Bear.fishingMethod = '';
                    $scope.Bear.fishingSuboption = '';
                    $scope.Bear.tally = 0;
                    $scope.Bear.fishing.push({method: $scope.Bear.fishingMethod,
                                     suboption: $scope.Bear.fishingSuboption,
                                     tally: $scope.Bear.tally,
                                     time: curTime
                                     });
                }
            }
            
            $scope.updateFish = function(fishingMethod, fishingSuboption, tally){
                var curTime = new Date().toLocaleTimeString();
                        console.log("add"+ fishingMethod + " " + fishingSuboption + " " + tally );
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].method = fishingMethod;
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].suboption = fishingSuboption;
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].tally = tally;
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].time = curTime;
            
                var tmp = $scope.Bear;
                //update the local copy of the bear
                $scope.BearList.add[$scope.Bear.index].fishing[($scope.BearList.add[$scope.Bear.index].fishing).length -1].method = fishingMethod;

                $scope.BearList.add[$scope.Bear.index].fishing[($scope.BearList.add[$scope.Bear.index].fishing).length -1].suboption = fishingSuboption;
            
                $scope.BearList.add[$scope.Bear.index].fishing[($scope.BearList.add[$scope.Bear.index].fishing).length -1].tally = tally;
            
                $scope.BearList.add[$scope.Bear.index].fishing[($scope.BearList.add[$scope.Bear.index].fishing).length -1].time = curTime;
            }

            $scope.addTally = function(fishingMethod, fishingSuboption, tally){
                var curTime = new Date().toLocaleTimeString();
            console.log("add"+ fishingMethod + " " + fishingSuboption + " " + tally );
                $scope.Bear.tally += 1;
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].method = fishingMethod;
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].suboption = fishingSuboption;
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].tally = tally + 1;
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].time = curTime;
            }
            
            $scope.removeTally = function(fishingMethod, fishingSuboption, tally){
                var curTime = new Date().toLocaleTimeString();
                        console.log("add"+ fishingMethod + " " + fishingSuboption + " " + tally );
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].method = fishingMethod;
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].suboption = fishingSuboption;
                if($scope.Bear.tally != 0){
                    $scope.Bear.tally -= 1;
                    $scope.Bear.fishing[$scope.Bear.fishing.length - 1].tally = tally - 1;
                    $scope.Bear.fishing[$scope.Bear.fishing.length - 1].time = curTime;
                }
            }
            
            $scope.testfunc = function() {
                console.log("I am working");
            }
            
            $scope.addBehaviour = function(type, desc){
                var curTime = new Date().toLocaleTimeString();
                var updated = false;
            
                //check for fishing
                if(type == "Feeding or Foraging"){
                    $scope.Bear.isFishing = false;
                }
            
                for(var n = 0; n < $scope.Bear.behaviour.length; n++) {
                   //if the this type of behaviour is alredy going on then update description
                   if($scope.Bear.behaviour[n].category == type) {
                      $scope.Bear.behaviour[n].description = desc;
                      $scope.Bear.behaviour[n].time = curTime;
                      updated = true;
                   }
                }
                if(updated == false) {
                       Bear.behaviour.push({
                            category: type,
                            description: desc,
                            time: curTime});
                }
            }

            $scope.removeBehaviour = function(ind, cat, desc, time) {
            var index = -1;
            for(var n = 0; n < $scope.Bear.behaviour.length; n++) {
            
                if($scope.Bear.behaviour[n].category == cat)
                    {
                        index = n;
                        break;
                    }
            }
                console.log(index + " "+ cat +" "+ "removed");
                if(index >= 0){
                    $scope.Bear.behaviour.splice(index, 1);
                }
            }
})

.controller('bearSpecCtrl', function($scope, BearList, Bear) {
    
    //get factory objects
    $scope.BearList = BearList;
	$scope.Bear = Bear;
            
    //create temp variables to hold changes
    $scope.tmpName = $scope.Bear.name;
    $scope.tmpZone = $scope.Bear.zone;
    $scope.tmpSize = $scope.Bear.size;
    $scope.tmpAge = $scope.Bear.age;
    $scope.tmpGender = $scope.Bear.gender;
    $scope.tmpSpecies = $scope.Bear.species;
    $scope.tmpMarkDescription = $scope.Bear.markDescription;
    $scope.tmpFurColour = $scope.Bear.furColour;
    $scope.tmpPawMeasured = $scope.Bear.pawMeasured;
    $scope.tmpCubs = $scope.Bear.cubs;
    $scope.tmpCubFurColour = $scope.Bear.cubFurColour;
    $scope.tmpCubAge = $scope.Bear.cubAge;
    $scope.tmpComment = $scope.Bear.comment;
    

    //update bear specs
	$scope.updateBear = function(index, name, zone, size, species, gender, age, markDescription, furColour, pawMeasured, cubs, cubAge, cubFurColour, comment){
        
        //debug stuff
        //console.log(" index " + index + "\n name " + name +"\n zone " + zone + " \n size " + size + "\n species " + species + "\n gender " + gender + "\n age " + age + "\n markdesc " + markDescription + "\n furColour " + furColour +"\n pawmeasured " + pawMeasured +" \n cubs " + cubs +"\n cubAge " + cubAge + "\n cubFurColour " + cubFurColour + "\n comment" +  comment);
        
        //update Bear in bear array
        $scope.BearList.add[index].name = name;
        $scope.BearList.add[index].zone = zone;
        $scope.BearList.add[index].size = size;
        $scope.BearList.add[index].age = age;
        $scope.BearList.add[index].gender = gender;
        $scope.BearList.add[index].species = species;
        $scope.BearList.add[index].markDescription = markDescription;
        $scope.BearList.add[index].furColour = furColour;
        $scope.BearList.add[index].pawMeasured = pawMeasured;
        $scope.BearList.add[index].cubs = cubs;
        $scope.BearList.add[index].cubFurColour = cubFurColour;
        $scope.BearList.add[index].cubAge = cubAge;
        $scope.BearList.add[index].comment = comment;
            
        //update local copy of bear
        $scope.Bear.name = name;
        $scope.Bear.zone = zone;
        $scope.Bear.size = size;
        $scope.Bear.age = age;
        $scope.Bear.gender = gender;
        $scope.Bear.species = species;
        $scope.Bear.markDescription = markDescription;
        $scope.Bear.furColour = furColour;
        $scope.Bear.pawMeasured = pawMeasured;
        $scope.Bear.cubs = cubs;
        $scope.Bear.cubFurColour = cubFurColour;
        $scope.Bear.cubAge = cubAge;
        $scope.Bear.comment = comment;
            
            
    }
            
});