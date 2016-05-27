angular.module('app.services')

.factory('Session', function($cordovaSQLite, $q){
    var Session =  { 
        id: '',
        firstName: '',
        lastName: '',
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
        var protocol = '';
        if(Session.viewingArea == 'Other'){
           protocol = Session.viewingAreaOther;
        }else{
            protocol = Session.viewingArea;
        }

        var defer = $q.defer();
                  
        $cordovaSQLite.execute(db, 
            'INSERT INTO sessions '
            + '(observers, park, park_site, protocol, stationary, zone_type, zone_comment, start_time, observation_mode)'
            + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [Session.nameResult.toString(), Session.park, Session.site, protocol, Session.stationary, Session.zoneSchema, Session.comment, 
            new Date().toLocaleTimeString(), Session.observationMode])
        .then(function(result) {
            console.log("Session save success" + result.insertId);
            defer.resolve(result);            
            Session.id = result.insertId;
        }, function(error) {
            console.log("Error on saving: " + error.message);
            defer.reject(error);
        });
        return defer.promise;
    }
    
    //return session object
    return Session;

});