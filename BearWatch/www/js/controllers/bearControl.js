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
        $scope.Bear.inSight = tmp.inSight;
        $scope.Bear.uStream = tmp.uStream;
        $scope.Bear.vAid = tmp.vAid;
        $scope.Bear.isFocal = tmp.isFocal;
		$scope.Bear.name = tmp.name;
		$scope.Bear.zone = tmp.zone;
		$scope.Bear.size = tmp.size;
        $scope.Bear.CFCBlonde = tmp.CFCBlonde;
        $scope.Bear.CBCLightBrown = tmp.CBCLightBrown;
        $scope.Bear.CFCBrown = tmp.CFCBrown;
        $scope.Bear.CFCDarkBrown = tmp.CFCDarkBrown;
        $scope.Bear.CFCOther = tmp.CFCOther;
        $scope.Bear.cubAge = tmp.cubAge;
		$scope.Bear.age = tmp.age;
		$scope.Bear.gender = tmp.gender;
		$scope.Bear.species = tmp.species;
		$scope.Bear.markDescription = tmp.markDescription;
		$scope.Bear.furColour = tmp.furColour;
        $scope.Bear.furCondition = tmp.furCondition;
        $scope.Bear.furCVariation = tmp.furCVariation;
		$scope.Bear.pawMeasured = tmp.pawMeasured;
		$scope.Bear.cubs = tmp.cubs;
        $scope.Bear.accuracy = tmp.accuracy;
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

        $scope.Bear.comment = tmp.comment;
	
    }

})

.controller('addBearCtrl', function($scope, $cordovaSQLite, Bear, BearList, Session, FBearSet, $ionicPopup, $location, $state, Human, $ionicScrollDelegate) {


	//get the factory objects
	$scope.Session = Session;
    $scope.Bear = Bear;
    $scope.BearList = BearList;
    $scope.FBearSet = FBearSet;

    //clear the bear object
    $scope.Bear.index = -1;
    $scope.Bear.id = -1;
    $scope.Bear.inSight = true;
    $scope.Bear.uStream = false;
    $scope.Bear.vAid = '';
    $scope.Bear.isFocal = '';
    $scope.Bear.name = '';
    $scope.Bear.zone = '';
    $scope.Bear.size = '';
    $scope.Bear.age = '';
    $scope.Bear.gender = '';
    $scope.Bear.species = '';
    $scope.Bear.markDescription = '';
    $scope.Bear.furColour = '';
    $scope.Bear.furCondition = '';
    $scope.Bear.CFCBlonde = false;
    $scope.Bear.CBCLightBrown = false;
    $scope.Bear.CFCBrown = false;
    $scope.Bear.CFCDarkBrown = false;
    $scope.Bear.CFCOther = false;
    $scope.Bear.furCVariation = '';
    $scope.Bear.pawMeasured = false;
    $scope.Bear.cubs = '';
    $scope.Bear.accuracy = '';
    $scope.Bear.cubFurColour = '';
    $scope.Bear.cubAge = '';
    $scope.Bear.behaviour = [];
    $scope.Bear.isFishing = false;
    $scope.Bear.fishing = [];
    $scope.Bear.fishingMethod = '';
    $scope.Bear.fishingSuboption = '';
    $scope.Bear.tally = 0;
    $scope.Bear.comment = '';
    
    //get the zone list
    var zoneList =[];
    for(var n = 0; n < $scope.Bear.Zones.length; n++){
        if($scope.Session.zoneSchema == $scope.Bear.Zones[n].name){
            zoneList = $scope.Bear.Zones[n].zones;
        }
    }
    $scope.zoneList = zoneList;
            
            
    //determine zone matrix and help image
    switch(Session.zoneSchema){
        case "Estuary":
            $scope.zoneImgURI = "img/estuary.png"
            break;
        case "River":
            $scope.zoneImgURI = "img/river.png"
            break;
        case "Terrestrial":
            $scope.zoneImgURI = "img/terrestrial.png"
            break;
        default:
            $scope.zoneImgURI = "img/pic_placeholder.png"
    }

    
   	
    var sIdInsertResult = "Not Initialized";
	var bearInsertResult = "Not Initialized";
	$scope.bearInsertResult = bearInsertResult;
	$scope.sIdInsertResult = sIdInsertResult;

    //scroll top function
    $scope.scrollDown = function(){
        $scope.showHelp = true;
        $ionicScrollDelegate.$getByHandle('newBearScroll').resize();
        $ionicScrollDelegate.$getByHandle('newBearScroll').anchorScroll(true);
        $ionicScrollDelegate.$getByHandle('newBearScroll').scrollBottom(true);
    }

    //hide help function
    $scope.hideHelp = function() {
        $scope.showHelp = false;
    } 

	//add bear with session id to bear table
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
                      
                    //update id and index of local copy
                    $scope.Bear.index = $scope.BearList.add.length;
                    $scope.Bear.id = result.insertId;
                      
                    //add the bear object in the bear array
        	    	$scope.BearList.add.push({
        	    		index: $scope.BearList.add.length,
        	    		id: result.insertId,
                        inSight: $scope.Bear.inSight,
                        uStream: $scope.Bear.uStream,
                        vAid: $scope.Bear.vAid,
                        isFocal: $scope.Bear.isFocal,
        	    		name: $scope.Bear.name,
        	    		zone: $scope.Bear.zone,
        	    		size: $scope.Bear.size,
        	    		age: $scope.Bear.age,
        	    		gender: $scope.Bear.gender,
        	    		species: $scope.Bear.species,
        	    		markDescription: $scope.Bear.markDescription,
                        furColour: $scope.Bear.furColour,
                        furCondition: $scope.Bear.furCondition,
                        furCVariation: $scope.Bear.furCVariation,
                        pawMeasured: $scope.Bear.pawMeasured,
        	    		cubs: $scope.Bear.cubs,
                        accuracy: $scope.Bear.accuracy,
        	    		cubFurColour: $scope.Bear.cubFurColour,
                        CFCBlonde: $scope.Bear.CFCBlonde,
                        CBCLightBrown: $scope.Bear.CBCLightBrown,
                        CFCBrown: $scope.Bear.CFCBrown,
                        CFCDarkBrown: $scope.Bear.CFCDarkBrown,
                        CFCOther: $scope.Bear.CFCOther,
                        cubAge: $scope.Bear.cubAge,
                        behaviour: [],
                        isFishing: false,
                        fishing: [],
                        fishingMethod: '',
                        fishingSuboption: '',
                        tally: 0,
        	    		comment: $scope.Bear.comment
        	    	});
                    
                    //update local copy of bear object
                    $scope.Bear = $scope.BearList.add[$scope.BearList.add.length - 1];
                      
                    //insert into log table
                    Bear.Log($scope.Session.id);
                    
                            
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


.controller('bearInfoCtrl', function($scope, Bear, BearList, Session, $ionicScrollDelegate, $q, $ionicNavBarDelegate) {
            
            //get all the factory objects
            $scope.Session = Session;
            $scope.session_id = Session.id;
            $scope.Bear = Bear;
            $scope.BearList = BearList; 
            
            $ionicNavBarDelegate.showBackButton(true);
            
            //create and attache all the behaviour arrays to scope
            var feeding = ["Pursuit for food", "Green Vegetation", "Berries", "Human Food"];
            var nonInteractive = ["Loafing/Resting", "Sleeping", "Walking", "Running"];
            var bBInteraction =[ "Playing", "Fighting", "Defense"];
            var bHInteraction = [ "Retreat", "Bear Approach", "Aggression"];
            var hBinteraction = [ "Retreat", "Approach Bear", "Aggression", "Enticing"];
            var alert = [ "Unknown", "Unaware", "Aware", "Disinterested", "Relaxed", "Bold/pushy", "Cautious", "Aggressive"];
            var habituationLevel = ["Habituated", "Non- Habituated", "Sub-Adult"];
            $scope.feeding = feeding;
            $scope.nonInteractive = nonInteractive;
            $scope.bBInteraction = bBInteraction;
            $scope.bHInteraction = bHInteraction;
            $scope.hBinteraction = hBinteraction;
            $scope.habituationLevel = habituationLevel;
            $scope.alert = alert;
            
            $scope.showHelp = false;
            
            
            $scope.sightChange = function(sight){
                if(sight == "true") {
                    $scope.BearList.add[Bear.index].inSight = false;
                    $scope.BearList.add[Bear.index].behaviour = [];
                    $scope.Bear.behaviour = [];
                    $scope.Bear.isFishing = false;
                } else {
                    $scope.BearList.add[Bear.index].inSight = true;
                }
                Bear.Log($scope.Session.id);
            }
            
            
            //scroll top function
            $scope.scrollDown = function(){
                $scope.showHelp = true;
                $ionicScrollDelegate.$getByHandle('mainScroll').resize();
                $ionicScrollDelegate.$getByHandle('mainScroll').anchorScroll(true);
                $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
               // $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
            }
            
            $scope.hideHelp = function() {
                $scope.showHelp = false;
            }
            
            //starting the fishing activity
            $scope.onFishing = function(){
            
                //turn off other feeding and foraging if running
                for(var n = 0; n < $scope.Bear.behaviour.length; n++) {
                    if($scope.Bear.behaviour[n].category == "Feeding or Foraging") {
                        $scope.Bear.behaviour[n].endTime = new Date();
                        //insert into log table
                        Bear.Log($scope.Session.id)
                        $scope.Bear.behaviour.splice(n, 1);
                    }
                }
            
                //turn fishing on/off
                $scope.Bear.isFishing = !($scope.Bear.isFishing);
            
                //if fishing is turned on add fishing session to fishing array
                if($scope.Bear.isFishing == true) {
                    var curTime = new Date();
                    $scope.Bear.fishingMethod = '';
                    $scope.Bear.fishingSuboption = '';
                    $scope.Bear.tally = 0;
                    $scope.Bear.fishing.push({method: $scope.Bear.fishingMethod,
                                     suboption: $scope.Bear.fishingSuboption,
                                     tally: $scope.Bear.tally,
                                     time: curTime
                                     });
            
                }
            
                //insert into log table
                Bear.Log($scope.Session.id);
            }
            
            //update fishing subcategories
            $scope.updateFish = function(fishingMethod, fishingSuboption, tally){
            
                //get now timestamp
                var curTime = new Date();
            
                //update fishing array
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].method = fishingMethod;
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].suboption = fishingSuboption;
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].tally = tally;
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].time = curTime;
            
                var tmp = $scope.Bear;
                //update the bear in the bear array
                $scope.BearList.add[$scope.Bear.index].fishing[($scope.BearList.add[$scope.Bear.index].fishing).length -1].method = fishingMethod;
                $scope.BearList.add[$scope.Bear.index].fishing[($scope.BearList.add[$scope.Bear.index].fishing).length -1].suboption = fishingSuboption;
                $scope.BearList.add[$scope.Bear.index].fishing[($scope.BearList.add[$scope.Bear.index].fishing).length -1].tally = tally;
                $scope.BearList.add[$scope.Bear.index].fishing[($scope.BearList.add[$scope.Bear.index].fishing).length -1].time = curTime;
            
                //insert into log table
                Bear.Log($scope.Session.id);
            }

            //To increment the number of fishes caught
            $scope.addTally = function(fishingMethod, fishingSuboption, tally){
            
                //get new timestamp
                var curTime = new Date();
            
                //update the fishing session
                $scope.Bear.tally += 1;
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].method = fishingMethod;
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].suboption = fishingSuboption;
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].tally = tally + 1;
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].time = curTime;
            
                //insert into log table
                Bear.Log($scope.Session.id);
            }
            
            //To decrement the number of fishes caught
            $scope.removeTally = function(fishingMethod, fishingSuboption, tally){
            
                //get the new timestamp
                var curTime = new Date();
            
                //update the fishing session
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].method = fishingMethod;
                $scope.Bear.fishing[$scope.Bear.fishing.length - 1].suboption = fishingSuboption;
            
                //check for negative number
                if($scope.Bear.tally != 0) {
            
                    //update fishing session
                    $scope.Bear.tally -= 1;
                    $scope.Bear.fishing[$scope.Bear.fishing.length - 1].tally = tally - 1;
                    $scope.Bear.fishing[$scope.Bear.fishing.length - 1].time = curTime;
            
                    //insert into log table
                    Bear.Log($scope.Session.id);
                }
            }
            
            //To add Beahaviour to bear Object
            $scope.addBehaviour = function(type, desc){
          
                //get the timestamp
                var curTime = new Date();
                var updated = false;

            
                //turn off ongoing fishing session
                if(type == "Feeding or Foraging") {
                    $scope.Bear.isFishing = false;
                }
            
                //chack for ongoing behaviour types
                for(var n = 0; n < $scope.Bear.behaviour.length; n++) {
                   //if the this type of behaviour is alredy going on then update description
                   if($scope.Bear.behaviour[n].category == type && type != 'Other') {

                   		//add end time to old behaviour
                   		$scope.Bear.behaviour[n].endTime = curTime;
               		    Bear.Log($scope.Session.id);
            
               		    //start the new behaviour
                    	$scope.Bear.behaviour[n].description = desc;
                     	$scope.Bear.behaviour[n].time = curTime;
                     	$scope.Bear.behaviour[n].endTime = '';
               		    
                      	updated = true;
                   }
                }
            
                // if not a update, add behaviour to the list
                if(updated == false) {
                       Bear.behaviour.push({
                            index: Bear.behaviour.length,
                            category: type,
                            description: desc,
                            time: curTime,
                            endTime: ''});
                }

                //clear the other filed
                $scope.other = '';
            
                //insert into log table
                Bear.Log($scope.Session.id);
            }
            
            
            //To remove behaviour from the list
            $scope.removeBehaviour = function(ind, cat, desc, time) {
            
                //get the index of behavior to be removed from the behaviour list
                var index = -1;

                for(var n = 0; n < $scope.Bear.behaviour.length; n++) {
                    if($scope.Bear.behaviour[n].category == cat && $scope.Bear.behaviour[n].description == desc) {
                        index = n;
                    }
                }
            
                //if unable to find index drop descreption
                if(index == -1){
                    for(var n = 0; n < $scope.Bear.behaviour.length; n++) {
                        if($scope.Bear.behaviour[n].category == cat) {
                            index = n;
                        }
                    }
                }
            
                //Remove behaviour if index found
                if(index >= 0){
                    //update end time
                    $scope.Bear.behaviour[index].endTime = new Date();
                    
                    //insert into log table
                    Bear.Log($scope.Session.id)
                    .then(
                          function(result){
                            $scope.Bear.behaviour.splice(index, 1);
                          },
                          function(error){
                            console.log("Error Found: " + error);
                          }
                    );
                }
            }
})


.controller('bearSpecCtrl', function($scope, BearList, Bear, Session, Human) {
    
    //get factory objects
    $scope.BearList = BearList;
	$scope.Bear = Bear;
    $scope.Session = Session;
            
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
    $scope.tmpAccuracy = $scope.Bear.accuracy;
    $scope.tmpUStream = $scope.Bear.uStream;
    $scope.tmpVAid = $scope.Bear.vAid;
    $scope.tmpFurCondition = $scope.Bear.furCondition;
    $scope.tmpFurCVariation = $scope.Bear.furCVariation;
    $scope.tmpCubFurColour = $scope.Bear.cubFurColour;
    $scope.tmpCFCBlonde = $scope.Bear.CFCBlonde;
    $scope.tmpCBCLightBrown = $scope.Bear.CBCLightBrown;
    $scope.tmpCFCBrown = $scope.Bear.CFCBrown;
    $scope.tmpCFCDarkBrown = $scope.Bear.CFCDarkBrown;
    $scope.tmpCFCOther = $scope.Bear.CFCOther;
    $scope.tmpCubAge = $scope.Bear.cubAge;
    $scope.tmpComment = $scope.Bear.comment;
    
            
    //get the zone list
    var zoneList =[];
    for(var n = 0; n < $scope.Bear.Zones.length; n++){
        if($scope.Session.zoneSchema == $scope.Bear.Zones[n].name){
            zoneList = $scope.Bear.Zones[n].zones;
        }
    }
    $scope.zoneList = zoneList;
            
            
    //determine zone matrix and help image
    switch(Session.zoneSchema){
        case "Estuary":
            $scope.zoneImgURI = "img/estuary.png"
            break;
        case "River":
            $scope.zoneImgURI = "img/river.png"
            break;
        case "Terrestrial":
            $scope.zoneImgURI = "img/terrestrial.png"
            break;
        default:
            $scope.zoneImgURI = "img/pic_placeholder.png"
    }
            


    //update bear specs
	$scope.updateBear = function(index, name, zone, size, species, gender, age, markDescription, furColour, pawMeasured, uStream, cubs, accuracy, cubAge, cubFurColour, comment, vAid, furCondition, furCVariation, CFCBlonde, CBCLightBrown, CFCBrown, CFCDarkBrown, CFCOther){
       

            
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
        $scope.BearList.add[index].uStream = uStream;
        $scope.BearList.add[index].vAid = vAid;
        $scope.BearList.add[index].furCondition = furCondition;
        $scope.BearList.add[index].furCVariation = furCVariation;
        $scope.BearList.add[index].cubs = cubs;
        $scope.BearList.add[index].accuracy = accuracy;
        $scope.BearList.add[index].cubFurColour = cubFurColour;
            
        $scope.BearList.add[index].CFCBlonde = CFCBlonde;
        $scope.BearList.add[index].CBCLightBrown = CBCLightBrown;
        $scope.BearList.add[index].CFCBrown = CFCBrown;
        $scope.BearList.add[index].CFCDarkBrown = CFCDarkBrown;
        $scope.BearList.add[index].CFCOther = CFCOther;
            
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
        $scope.Bear.uStream = uStream;
        $scope.Bear.vAid = vAid;
        $scope.Bear.furCondition = furCondition;
        $scope.Bear.furCVariation = furCVariation;
        $scope.Bear.cubs = cubs;
        $scope.Bear.accuracy = accuracy;
        $scope.Bear.cubFurColour = cubFurColour;
        $scope.Bear.CFCBlonde = CFCBlonde;
        $scope.Bear.CBCLightBrown = CBCLightBrown;
        $scope.Bear.CFCBrown = CFCBrown;
        $scope.Bear.CFCDarkBrown = CFCDarkBrown;
        $scope.Bear.CFCOther = CFCOther;
        $scope.Bear.cubAge = cubAge;
        $scope.Bear.comment = comment;
            
        //insert into log table
        Bear.Log($scope.Session.id);
    }
            
});