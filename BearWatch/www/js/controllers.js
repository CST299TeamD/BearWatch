angular.module('app.controllers', [])

.controller('dashCtrl', function($scope, $ionicPopup, $state, $location, $cordovaSQLite, $ionicHistory, Session, Comment, Enviro, Human, Picture, Timer, Bear, GPS) {

   $scope.showConfirm = function() {
      var confirmPopup = $ionicPopup
      .confirm({
         title: 'End Session',
         template: 'Once a session is closed it cannot be re-opened. Continue closing session?'
      });

      confirmPopup
      .then(function(res) {
         if(res) {
            var time = new Date();
            var utm = GPS.utmZone;
            var east = GPS.easting;
            var north = GPS.northing;
            
            $cordovaSQLite.execute(db,
             'INSERT INTO logs '
             + '(timestamp, session_id, utm_zone, northing, easting)'
             + ' VALUES (?, ?, ?, ?, ?)',
             [time, Session.id, utm, north, east])
            .then(function(result) {
                    //console.log(result);
                  }, function(error) {
                    console.log("Error Found: " + error);
                  });
            
            $cordovaSQLite.execute(db, 
               'UPDATE sessions SET finish_time = ? WHERE session_id = ?', [new Date(), Session.id])
            .then(function(result) {
               //console.log(result);

               //clean application
               Bear.reset();
               Session.reset();
               Comment.reset();
               Enviro.reset();
               Human.reset();
               Picture.reset();
			         Timer.reset();
               $ionicHistory.clearHistory();
               $ionicHistory.clearCache();
               $location.path("/ReviewList");
            }, function(error) {
               console.log("Error Found: " + error);
            });
         } 
      });
   }
});
