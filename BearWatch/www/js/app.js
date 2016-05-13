// Ionic Starter App

//global variables
var db;
var debug = true;

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ngIOS9UIWebViewPatch'])

.run(function($ionicPlatform, $cordovaSQLite, $cordovaCamera, $cordovaFile, $cordovaEmailComposer, $cordovaFileTransfer) {
  $ionicPlatform.ready(function() {
  
    //setup database schema
    db = $cordovaSQLite.openDB({name:"bear_watch.db", location:'default'});

    /***** Lookup Tables ******/

    //park names table
    $cordovaSQLite.execute(db, 
      "CREATE TABLE IF NOT EXISTS lv_parks ("
      + "park_id       INTEGER PRIMARY KEY NOT NULL, "
      + "park_name         TEXT);"
    );

    /****** Storage Tables ******/

    //sessions table
    $cordovaSQLite.execute(db, 
      "CREATE TABLE IF NOT EXISTS sessions ("
      + "session_id       INTEGER PRIMARY KEY NOT NULL, "
      + "observers         TEXT    , "
      + "park              TEXT    , "
      + "park_site         TEXT    , "
      + "protocol          TEXT    , "
      + "stationary        TEXT    , "
      + "zone_type         TEXT    , "
      + "zone_comment      TEXT    , "
      + "start_time        TEXT    , "
      + "finish_time       TEXT    , "
      + "collection_mode   TEXT);"
    );

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }  
  });
})