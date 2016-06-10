angular.module('app.services')


//Bear Object
.factory('Bear', function($cordovaSQLite, $q, GPS, BearList, FBearSet, Session){
    var Bear = {
        index: -1,
        id: -1,
        inSight: true,
        uStream: false,
        vAid: '',
        isFocal: '',
        name: '',
        zone: '',
        size: '',
        age: '',
        gender: '',
        species: '',
        markDescription: '',
        furColour: '',
        furCondition: '',
        furCVariation: '',
        pawMeasured: false,
        cubs: '',
        accuracy: '',
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
         
    //reset the bear factory
    Bear.reset = function(){
         
         for(var i = 0; i < BearList.add.length ;i++) {
            for( var j = 0; j < BearList.add[i].behaviour.length; j++){
                try {
                    if(BearList.add[i].behaviour[j].endTime == '') {
                        BearList.add[i].behaviour[j].endTime = new Date();
                        try{
                            Bear.behaviour[j].endTime = new Date();
                        } catch(er){}
                    }
                } catch(err) {
                    console.log("No ongoing behaviour");
                }
         
            }
         }
         Bear.Log(Session.id);
         
         
         Bear.index = -1;
         Bear.id = -1;
         Bear.inSight = true,
         Bear.isFocal = '';
         Bear.name = '';
         Bear.zone = '';
         Bear.size = '';
         Bear.age = '';
         Bear.gender = '';
         Bear.species = '';
         Bear.markDescription = '';
         Bear.furColour = '';
         Bear.pawMeasured = false;
         Bear.cubs = '';
         Bear.accuracy = '';
         Bear.cubFurColour = '';
         Bear.cubAge = '';
         Bear.behaviour = [];
         Bear.isFishing = false;
         Bear.fishing = [];
         Bear.fishingMethod = '';
         Bear.fishingSuboption = '';
         Bear.tally = 0;
         Bear.comment = '';
         BearList.add = [];
         FBearSet.isFocalPresent = '';
         console.log("Bear reset");
         
    }
    //diffrent zones for locations
    Bear.Zones = [{name:"River", zones: ["1", "1+", "2", "2+", "3", "3+", "4", "5", "6", "7", "7+", "8", "8+", "9", "9+"]},
                       {name: "Estuary", zones: ["1", "1+", "2", "2+", "4", "5", "6", "7", "7+", "8", "8+"]},
                       {name: "Terrestrial", zones: ["1", "1+", "1a", "1b", "2", "2+", "3", "3+", "3a", "3b", "4", "4+", "5", "6", "6+", "7", "7+", "7a", "7b", "8", "8+", "9", "9+", "9a", "9b"]}]
    
         
    Bear.Log = function(sessionId){
        //get the time
        var time = new Date();
        var bearlog = angular.toJson(Bear, false);
        var defer = $q.defer();
        
        //get gps coordinates
        var utm = GPS.utmZone;
        var east = GPS.easting;
        var north = GPS.northing;
       
        $cordovaSQLite.execute(db,
                        'INSERT INTO logs '
                        + '(timestamp, session_id, bear_id, bear, utm_zone, northing, easting)'
                        + ' VALUES (?, ?, ?, ?, ?, ?, ?)',
                        [time, sessionId, Bear.id, bearlog, utm, north, east])
        .then(function(result) {
            console.log("bear Logged with log id - " + result.insertId);
            console.log(Bear);
            defer.resolve(result);
        }, function(error) {
            console.log("Error on saving comment: " + error.message);
            defer.reject(error);
              
        });
         
        return defer.promise;
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