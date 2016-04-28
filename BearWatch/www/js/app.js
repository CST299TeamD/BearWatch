// Ionic Starter App

//global DB Variable
var db = null;

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
                       
                       db = $cordovaSQLite.openDB({ name: "BW.db" });
                       $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS sessions ("
                                              + "session_id       INTEGER PRIMARY KEY NOT NULL, "
                                              + "protocol          TEXT    NOT NULL, "
                                              + "collection_mode   TEXT    NOT NULL, "
                                              + "park              TEXT    NOT NULL, "
                                              + "water_body text   TEXT    NOT NULL, "
                                              + "flow              TEXT    NOT NULL, "
                                              + "start_time        TEXT    NOT NULL, "
                                              + "finish_time       TEXT    NOT NULL, "
                                              + "water_clarity     TEXT    NOT NULL, "
                                              + "water_temp        TEXT    NOT NULL, "
                                              + "observers         TEXT    NOT NULL);")
                        
  });
})