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
        CFCBlonde: false,
        CBCLightBrown: false,
        CFCBrown: false,
        CFCDarkBrown: false,
        CFCOther: false,
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
                    }
                } catch(err) {
                    console.log("Error Found: " + err);
                }
         
            }
         }
         
         Bear.LastLog(Session.id);
        
         
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
         
    }
    //diffrent zones for locations
    Bear.Zones = [{name:"River", zones: ["1", "1+", "2", "2+", "3", "3+", "4", "5", "6", "7", "7+", "8", "8+", "9", "9+"]},
                       {name: "Estuary", zones: ["1", "1+", "2", "2+", "4", "5", "6", "7", "7+", "8", "8+"]},
                       {name: "Terrestrial", zones: ["1", "1+", "1a", "1b", "2", "2+", "3", "3+", "3a", "3b", "4", "4+", "5", "6", "6+", "7", "7+", "7a", "7b", "8", "8+", "9", "9+", "9a", "9b"]}];
    
    Bear.LastLog = function(sessionId){
         
         var time = new Date();
         
         var utm = GPS.utmZone;
         var east = GPS.easting;
         var north = GPS.northing;
         var bearlog = "";
         for(var i = 0; i < BearList.add.length ;i++){
             //ßBear. = BearList.add[i].;
             Bear.index = BearList.add[i].index;
             Bear.id = BearList.add[i].id;
             Bear.inSight = BearList.add[i].inSight;
             Bear.uStream = BearList.add[i].uStream;
             Bear.vAid = BearList.add[i].vAid;
             Bear.isFocal = BearList.add[i].isFocal;
             Bear.name = BearList.add[i].name;
             Bear.zone = BearList.add[i].zone;
             Bear.size = BearList.add[i].size;
             Bear.age = BearList.add[i].age;
             Bear.gender = BearList.add[i].gender;
             Bear.species = BearList.add[i].species;
             Bear.markDescription = BearList.add[i].markDescription;
             Bear.furColour = BearList.add[i].furColour;
             Bear.furCondition = BearList.add[i].furCondition;
             Bear.furCVariation = BearList.add[i].furCVariation;
             Bear.pawMeasured = BearList.add[i].pawMeasured;
             Bear.cubs = BearList.add[i].cubs;
             Bear.accuracy = BearList.add[i].accuracy;
             Bear.cubFurColour = BearList.add[i].cubFurColour;
             Bear.CFCBlonde = BearList.add[i].CFCBlonde;
             Bear.CBCLightBrown = BearList.add[i].CBCLightBrown;
             Bear.CFCBrown = BearList.add[i].CFCBrown;
             Bear.CFCDarkBrown = BearList.add[i].CFCDarkBrown;
             Bear.CFCOther = BearList.add[i].CFCOther;
             Bear.cubAge = BearList.add[i].cubAge;
             Bear.behaviour = BearList.add[i].behaviour;
             Bear.isFishing = BearList.add[i].isFishing;
             Bear.fishing = BearList.add[i].fishing; 
             Bear.fishingMethod = BearList.add[i].fishingMethod;
             Bear.fishingSuboption = BearList.add[i].fishingSuboption;
             Bear.tally = BearList.add[i].tally;
             Bear.comment = BearList.add[i].comment;
                 

             bearlog = angular.toJson(Bear, false);
             $cordovaSQLite.execute(db,
                                    'INSERT INTO logs '
                                    + '(timestamp, session_id, bear_id, bear, utm_zone, northing, easting)'
                                    + ' VALUES (?, ?, ?, ?, ?, ?, ?)',
                                    [time, sessionId, Bear.id, bearlog, utm, north, east])
             .then(function(result) {
                   
                   }, function(error) {
                    console.log("Error Found: " + error);
                   });
         }
         
    }
         
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
            defer.resolve(result);
        }, function(error) {
            console.log("Error Found: " + error);
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