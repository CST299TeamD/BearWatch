angular.module('app.services')

.factory('Session', function($cordovaSQLite){
    var Session =  { 
        id: '',
        observer: '',
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
        var id = '';
        var protocol = '';
        var time = new Date();
        if(Session.viewingArea == 'Other'){
           protocol = Session.viewingAreaOther;
        }else{
            protocol = Session.viewingArea;
        }
        
        $cordovaSQLite.execute(db, 
            'INSERT INTO sessions '
            + '(observers, park, park_site, protocol, stationary, zone_type, zone_comment, start_time, observation_mode)'
            + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [Session.nameResult.toString(), Session.park, Session.site, protocol, Session.stationary, Session.zoneSchema, Session.comment, 
            time.toLocaleTimeString(), Session.observationMode])
        .then(function(result) {
            console.log("Session save success" + result.insertId);            
            Session.id = id = result.insertId;
            return id;
        }, function(error) {
            console.log("Error on saving: " + error.message);
        });
    }
    
    //return session object
    return Session;

});