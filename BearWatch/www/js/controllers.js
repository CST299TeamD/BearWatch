angular.module('app.controllers', [])

.controller('dashCtrl', function($scope, $ionicPopup, $state, $location, $cordovaSQLite, $ionicHistory, Session, Comment, Enviro, Human, Picture) {

   $scope.showConfirm = function() {
      var confirmPopup = $ionicPopup
      .confirm({
         title: 'End Session',
         template: 'Once a session is closed it cannot be re-opened. Continue closing session?'
      });

      confirmPopup
      .then(function(res) {
         if(res) {
            console.log('Session ending!');
            $cordovaSQLite.execute(db, 
               'UPDATE sessions SET finish_time = ? WHERE session_id = ?', [new Date().toLocaleTimeString(), Session.id])
            .then(function(result) {
               console.log("Session finish and save success");
               console.log(result);
               $location.path("/ReviewList");

               //clean application
               Session.reset();
               Comment.reset();
               Enviro.reset();
               Human.reset();
               Picture.reset();
               $ionicHistory.clearHistory();
               $ionicHistory.clearCache();
            }, function(error) {
               console.log("Error on saving: " + error.message);
            });
         } else {
            console.log('Not sure!');
         }
      });
   }
});
