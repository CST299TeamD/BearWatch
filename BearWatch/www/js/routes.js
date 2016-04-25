angular.module('app.routes', ['ionicUIRouter'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })
  
  .state('startNewSession', {
    url: '/srartNewSession',
    templateUrl: 'templates/startNewSession.html',
    controller: 'startNewSessionCtrl'
  })

  .state('startNewSessionCont', {
    url: '/startNewSessionCont',
    templateUrl: 'templates/startNewSessionCont.html',
    controller: 'startNewSessionContCtrl'
  })
  
  .state('observationMode', {
    url: '/ObservationMode',
    templateUrl: 'templates/observationMode.html',
    controller: 'observationModeCtrl'
  })

  .state('focalTab', {
    url: '/focal',
    templateUrl: 'templates/focalTab.html',
    abstract:true
  })


  .state('focalTab.bear', {
    url: '/focalBear',
    views: {
      'tab1': {
        templateUrl: 'templates/focalBear.html',
        controller: 'focalCtrl'
      }
    }
  })

  .state('focalTab.addNewBear', {
    url: '/addNewBear',
    views: {
      'tab1': {
        templateUrl: 'templates/focalAddNewBear.html',
        controller: 'addNewBearCtrl'
      }
    }
  })


  .state('focalTab.human', {
    url: '/focalHuman',
    views: {
      'tab2': {
        templateUrl: 'templates/focalHuman.html',
        controller: 'focalHumanCtrl'
      }
    }
  })  

  .state('focalTab.environment', {
    url: '/focalEnvironment',
    views: {
      'tab3': {
        templateUrl: 'templates/focalEnvironment.html',
        controller: 'focalEnvironmentCtrl'
      }
    }
  })

  .state('focalTab.comment', {
    url: '/focalComment',
    views: {
      'tab4': {
        templateUrl: 'templates/focalTabComment.html',
        controller: 'focalTabCommentCtrl'
      }
    }
  })
	
  .state('focalTab.camera', {
    url: '/focalCamera',
    views: {
      'tab5': {
        templateUrl: 'templates/focalTabCamera.html',
        controller: 'focalTabCameraCtrl'
      }
    }
  })
  
  
  .state('scanningTab', {
    url: '/scanning',
    templateUrl: 'templates/scanningTab.html',
    abstract:true
  })


  .state('scanningTab.bear', {
    url: '/ScanningBear',
    views: {
      'tab1': {
        templateUrl: 'templates/scanningBear.html',
        controller: 'scanningBearCtrl'
      }
    }
  })  
  
    
  .state('scanningTab.human', {
    url: '/ScanningHuman',
    views: {
      'tab2': {
        templateUrl: 'templates/scanningHuman.html',
        controller: 'scanningHumanCtrl'
      }
    }
  })  
	
	
 $urlRouterProvider.otherwise('/home')

});