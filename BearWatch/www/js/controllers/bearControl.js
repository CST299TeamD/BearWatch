angular.module('app.controllers')

.controller('bearCtrl', function($scope, $cordovaSQLite, BearList, Bear, $location) {
	
	$scope.BearList = BearList;
	$scope.Bear = Bear;

	$scope.changeBear = function(index){

		var tmp = $scope.BearList.add[index];
		$scope.Bear.id = tmp.id;
		console.log("index " + tmp.index)
		$scope.Bear.index = tmp.index;
		$scope.Bear.name = tmp.name;
		$scope.Bear.zone = tmp.location;
		$scope.Bear.size = tmp.size;
		$scope.Bear.age = tmp.age;
		$scope.Bear.gender = tmp.gender;
		$scope.Bear.species = tmp.species;
		$scope.Bear.markDescription = tmp.markDescription;
		$scope.Bear.furColour = tmp.furColour;
		$scope.Bear.pawMeasered = tmp.pawMeasured;
		$scope.Bear.cubs = tmp.cubs;
		$scope.Bear.cubFurColour = tmp.cubFurColour;
		$scope.Bear.cubAge = tmp.cubAge;
		$scope.Bear.behaviour = tmp.behaviour;
		$scope.Bear.comment = tmp.comment;
		//$location.path("/BearInfo");		
	}
})

.controller('addBearCtrl', function($scope, $cordovaSQLite, Bear, BearList, Session) {
	//global debug var
	$scope.debug = debug;

	//fake session id
	$scope.Session = Session;
	$scope.session_id = Session.id;
	console.log($scope.session_id);
   	
   	//var session_id = 1; 
   	//$scope.session_id = session_id;
	$scope.Bear = Bear;
	$scope.BearList = BearList;
  	$scope.Bear.name = '';
    $scope.Bear.zone = '';
    $scope.Bear.size = '';
    $scope.Bear.age = '';
    $scope.Bear.gender = '';
    $scope.Bear.species = '';
    $scope.Bear.markDescription = '';
    $scope.Bear.furColour = '';
    $scope.Bear.pawMeasered = '';
    $scope.Bear.cubs = '';
    $scope.Bear.cubFurColour = '';
    $scope.Bear.cubAge = '';
    $scope.Bear.behaviour = [];
    $scope.Bear.comment = '';

   	var sIdInsertResult = "Not Initialized";
	var bearInsertResult = "Not Initialized";
	$scope.bearInsertResult = bearInsertResult;
	$scope.sIdInsertResult = sIdInsertResult;

	//add bear to fake session id - to be updated
	$scope.addBear = function(){
		//insert into bears table
		$cordovaSQLite.execute(db, 'INSERT INTO bears (bear_name, bear_location, size, age, gender, species, '
								  +'mark_desc, fur_colour, paw_measure, cubs, cub_fur, cub_age, comment, '
								  +	'session_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
									[$scope.Bear.name, $scope.Bear.zone, $scope.Bear.size, $scope.Bear.age, $scope.Bear.gender,
									$scope.Bear.species, $scope.Bear.markDescription, $scope.Bear.furColour, $scope.Bear.pawMeasered,
									$scope.Bear.cubs, $scope.Bear.cubFurColour, $scope.Bear.cubAge, $scope.bearComment, $scope.session_id])
	    	.then(function(result) {
    	    	$scope.bearInsertResult = "Bear inserted";

    	    	$scope.BearList.add.push({
    	    		index: $scope.BearList.add.length,
    	    		id: result.insertId,
    	    		name: $scope.Bear.name,
    	    		location: $scope.Bear.zone,
    	    		size: $scope.Bear.size,
    	    		age: $scope.Bear.age,
    	    		gender: $scope.Bear.gender,
    	    		species: $scope.Bear.species,
    	    		markDescription: $scope.Bear.markDescription,
    	    		behaviour: [],
    	    		furColour: $scope.Bear.furColour,
    	    		pawMeasured: $scope.Bear.pawMeasered,
    	    		cubs: $scope.Bear.cubs,
    	    		cubFurColour: $scope.Bear.cubFurColour,
    	    		cubAge: $scope.Bear.cubAge,
    	    		comment: $scope.bearComment
    	    	});
                        
    		}, function(error) {
       	 		$scope.bearInsertResult = "Error on inserting Bear: " + error.message;
    		})
	}
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

            
            var feeding = ["Pursuit for food", "Green Vegetation", "Berries", "Fishing", "Human Food"];
            var nonInteractive = ["Loafing/Resting", "Sleeping", "Walking", "Running"];
            var bBInteraction =["Alert/Vigilance", "Playing", "Fighting", "Defense"];
            var bHInteraction = ["Alert/Vigilance", "Retreat", "Bear Approach"];
            var hBinteraction = ["Alert/Vigilance", "Retreat", "Approach Bear", "Aggression "];
            var habituationLevel = ["Habituated", "Non- Habituated", "SUbadult"];
            
            $scope.feeding = feeding;
            $scope.nonInteractive = nonInteractive;
            $scope.bBInteraction = bBInteraction;
            $scope.bHInteraction = bHInteraction;
            $scope.hBinteraction = hBinteraction;
            $scope.habituationLevel = habituationLevel;
            $scope.test= "No behaviour";

            $scope.addBehaviour = function(type, desc){
            	Bear.behaviour.push(type + " - " + desc);

            }



})

.controller('bearSpecCtrl', function($scope, BearList, Bear) {
    $scope.BearList = BearList;
	$scope.Bear = Bear;

	$scope.updateBear = function(index){

        var tmp = $scope.Bear;
        //update the local copy of the bear
        $scope.BearList.add[index].id = tmp.id;
        $scope.BearList.add[index].index = tmp.index;
        $scope.BearList.add[index].name = tmp.name;
        $scope.BearList.add[index].zone = tmp.location;
        $scope.BearList.add[index].size = tmp.size;
        $scope.BearList.add[index].age = tmp.age;
        $scope.BearList.add[index].gender = tmp.gender;
        $scope.BearList.add[index].species = tmp.species;
        $scope.BearList.add[index].markDescription = tmp.markDescription;
        $scope.BearList.add[index].furColour = tmp.furColour;
        $scope.BearList.add[index].pawMeasered = tmp.pawMeasured;
        $scope.BearList.add[index].cubs = tmp.cubs;
        $scope.BearList.add[index].cubFurColour = tmp.cubFurColour;
        $scope.BearList.add[index].cubAge = tmp.cubAge;
        $scope.BearList.add[index].behaviour = tmp.behaviour;
        $scope.BearList.add[index].comment = tmp.comment;


        //update the bear in the database
    }
            
});