// Ionic Starter App

//global variables
var db;
var db_error = false;

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ngIOS9UIWebViewPatch', 'ngMessages', 'chart.js'])

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.swipeBackEnabled(false);
 })


.run(function($ionicPlatform, $cordovaSQLite, $cordovaCamera, $cordovaFile, $cordovaEmailComposer, $cordovaFileTransfer, $cordovaGeolocation) {
  $ionicPlatform.ready(function() {
    

    //setup database schema
    db = $cordovaSQLite.openDB({name:"bear_watch.db", location:'default'});

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
      + "observer_zone     TEXT    , "
      + "zone_comment      TEXT    , "
      + "survey_sched      TEXT    , "
      + "start_time        TEXT    , "
      + "finish_time       TEXT    , "
      + "active_time       TEXT    , "
      + "resting_time      TEXT    , "
      + "alt_media         TEXT    , "
      + "observation_mode  TEXT);"
    ).then(function(result) {
        //console.log(result);
    }, function(error) {
        db_error = true;
        console.log("Error Found: " + error);
    });

    //bear table
    $cordovaSQLite.execute(db, 
      "CREATE TABLE IF NOT EXISTS bears ("
      + "bear_id       INTEGER PRIMARY KEY NOT NULL, "
      + "bear_name         TEXT    , "
      + "bear_location     TEXT    , "
      + "size              TEXT    , "
      + "age               TEXT    , "
      + "gender            TEXT    , "
      + "species           TEXT    , "
      + "mark_desc         TEXT    , "
      + "fur_colour        TEXT    , "
      + "paw_measure       TEXT    , "
      + "cubs              TEXT    , "
      + "cub_fur           TEXT    , "
      + "behavior          TEXT    , "
      + "cub_age           TEXT    , "
      + "comment           TEXT    , "      
      + "session_id        INTEGER , "
      + "FOREIGN KEY(session_id) REFERENCES sessions(session_id));"
    ).then(function(result) {
        //console.log(result);
    }, function(error) {
        db_error = true;
        console.log("Error Found: " + error);
    });


    //logs table
    $cordovaSQLite.execute(db, 
      "CREATE TABLE IF NOT EXISTS logs ("
      + "log_id       INTEGER PRIMARY KEY NOT NULL, "
      + "timestamp         TEXT    , "
      + "utm_zone          TEXT    , "
      + "northing          TEXT    , "
      + "easting           TEXT    , "
      + "comment           TEXT    , "
      + "comment_type      TEXT    , "      
      + "water_level       TEXT    , "
      + "water_clarity     TEXT    , "
      + "cloud_cover       TEXT    , "
      + "precipitation     TEXT    , "
      + "wind              TEXT    , "
      + "wind_direction    TEXT    , "
      + "temperature       INTEGER , "
      + "humididty          INTEGER , "
      + "visibility        TEXT    , "
      + "obstruction       TEXT    , "
      + "obstr_desc        TEXT    , "
      + "noise_level       TEXT    , "
      + "zone              TEXT    , "
      + "human_count       TEXT    , "
      + "motorized_name    TEXT    , "
      + "motorized_action  TEXT    , "
      + "motorized_desc    TEXT    , "
      + "human_type        TEXT    , "
      + "human_other       TEXT    , "
      + "human_behavior    TEXT    , "
      + "picture_data      TEXT    , "
      + "picture_subjects  TEXT    , "
      + "collection_mode   TEXT    , "
      +	"bear_id       	   INTEGER , "
      +	"bear       	     TEXT    , "                           
      + "species           TEXT    , "
      + "session_id        INTEGER , "
      + "FOREIGN KEY(bear_id) REFERENCES bears(bear_id),"      
      + "FOREIGN KEY(session_id) REFERENCES sessions(session_id));"
    ).then(function(result) {
        //console.log(result);
    }, function(error) {
        db_error = true;
        console.log("Error Found: " + error);
    });

    //food sources table
    $cordovaSQLite.execute(db, 
      "CREATE TABLE IF NOT EXISTS food_sources ("
      + "food_source_id    INTEGER PRIMARY KEY NOT NULL, "
      + "food_source       TEXT    , "
      + "availability      TEXT    , "
      + "comment           TEXT    , "
      + "session_id        INTEGER , "
      + "FOREIGN KEY(session_id) REFERENCES sessions(session_id));"
    ).then(function(result) {
        //console.log(result);
    }, function(error) {
        db_error = true;
        console.log("Error Found: " + error);
    });

    //Prevent the native UIScrollView from moving when an input is focused
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.disableScroll(true);
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }  
  });
})
