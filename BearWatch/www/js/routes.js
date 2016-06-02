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
    url: '/startNewSession',
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

  .state('tab', {
    url: '/tab',
    templateUrl: 'templates/tab.html',
    abstract:true,
    controller: 'dashCtrl'
  })


  .state('tab.bear', {
    cache: false,
    url: '/Bear',
    views: {
      'tab1': {
        templateUrl: 'templates/bear.html',
        controller: 'bearCtrl'
      }
    }
  })

  .state('tab.addNewBear', {
    cache: false,
    url: '/addBear',
    views: {
      'tab1': {
        templateUrl: 'templates/addBear.html',
        controller: 'addBearCtrl'
      }
    }
  })


  .state('tab.human', {
    url: '/Human',
    views: {
      'tab2': {
        templateUrl: 'templates/human.html',
        controller: 'humanCtrl'
      }
    }
  })  

  .state('tab.environment', {
    url: '/Environment',
    views: {
      'tab3': {
        templateUrl: 'templates/environment.html',
        controller: 'environmentCtrl'
      }
    }
  })

  .state('tab.comment', {
    url: '/Comment',
    views: {
      'tab4': {
        templateUrl: 'templates/tabComment.html',
        controller: 'tabCommentCtrl'
      }
    }
  })
	
  .state('tab.camera', {
    url: '/Camera',
    views: {
      'tab5': {
        templateUrl: 'templates/tabCamera.html',
        controller: 'tabCameraCtrl'
      }
    }
  })
  
 
  .state('reviewList', {
    url: '/ReviewList',
    cache: false,
    templateUrl: 'templates/reviewList.html',
    controller: 'reviewListCtrl'
  })


  .state('tab.bearInfo', {
    url: '/BearInfo',
    cache: false,
    views: {
      'tab1': {
        templateUrl: 'templates/bearInfo.html',
        controller: 'bearInfoCtrl'
      }
    }
  })
        
  .state('tab.changeSpecs', {
    url: '/BearSpecs',
      views: {
        'tab1': {
          templateUrl: 'templates/bearSpecifications.html',
          controller: 'bearSpecCtrl'
        }
      }
  })


        
 $urlRouterProvider.otherwise('/home')

});

