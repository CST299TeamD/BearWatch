angular.module('app.services')


//Bear Object
.factory('Bear', function($cordovaSQLite){
    var Bear = {
        index: -1,
        id: -1,
        isFocal: '',
        name: '',
        zone: '',
        size: '',
        age: '',
        gender: '',
        species: '',
        markDescription: '',
        furColour: '',
        pawMeasured: false,
        cubs: '',
        cubFurColour: '',
        cubAge: '',
        behaviour: [],
        isFishing: false,
        fishing: [],
        fishingMethod: '',
        fishingSuboption: '',
        tally: 0,
        comment: ''
    };
    
    Bear.Log = function(sessionId){
        //get the time
        var time = new Date().toLocaleTimeString();
        var bearlog = angular.toJson(Bear, false);
        $cordovaSQLite.execute(db,
                        'INSERT INTO logs '
                        + '(timestamp, session_id, bear_id, bear)'
                        + ' VALUES (?, ?, ?, ?)',
                        [time, sessionId, Bear.id, bearlog])
        .then(function(result) {
            console.log("bear Logged with log id - " + result.insertId);
            console.log(Bear);
        }, function(error) {
            console.log("Error on saving comment: " + error.message);
        });
     }
    return Bear;
})

//boolean to check for presence of focal bear in session
.factory('FBearSet', [function(){
    return {
        isFocalPresent: '',
    };
                     
}])

//array to add all the bear objects
.factory('BearList', [function(){
    return {
        add: [],
    };
                  
}]);