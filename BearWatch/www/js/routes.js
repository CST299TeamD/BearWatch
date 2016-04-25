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


<<<<<<< HEAD
  .state('focalTab.bear', {
    url: '/focalBear',
    views: {
      'tab1': {
=======
  .state('focalTabsController.focal', {
    url: '/page21',
    views: {
      'tab2': {
>>>>>>> 56d809fa6402ddec8182e0884066cd049badada3
        templateUrl: 'templates/focalBear.html',
        controller: 'focalCtrl'
      }
    }
  })

<<<<<<< HEAD
  .state('focalTab.addNewBear', {
    url: '/addNewBear',
    views: {
      'tab1': {
        templateUrl: 'templates/focalAddNewBear.html',
        controller: 'addNewBearCtrl'
=======
  .state('focalTabsController.feedingForaging', {
    url: '/page13',
    views: {
      'tab2': {
        templateUrl: 'templates/feedingForaging.html',
        controller: 'feedingForagingCtrl'
      }
    }
  })

  .state('focalTabsController.nonInteractive', {
    url: '/page24',
    views: {
      'tab2': {
        templateUrl: 'templates/nonInteractive.html',
        controller: 'nonInteractiveCtrl'
>>>>>>> 56d809fa6402ddec8182e0884066cd049badada3
      }
    }
  })

<<<<<<< HEAD

  .state('focalTab.human', {
    url: '/focalHuman',
=======
  .state('focalTabsController.bearBearInteraction', {
    url: '/page26',
    views: {
      'tab2': {
        templateUrl: 'templates/bearBearInteraction.html',
        controller: 'bearBearInteractionCtrl'
      }
    }
  })

  .state('focalTabsController.bearHumanInteraction', {
    url: '/page27',
>>>>>>> 56d809fa6402ddec8182e0884066cd049badada3
    views: {
      'tab2': {
        templateUrl: 'templates/focalHuman.html',
        controller: 'focalHumanCtrl'
      }
    }
<<<<<<< HEAD
  })  
=======
  })

  .state('focalTabsController.human', {
    url: '/page28',
    views: {
      'tab4': {
        templateUrl: 'templates/focalHuman.html',
        controller: 'humanCtrl'
      }
    }
  })

  .state('page', {
    url: '/page19',
    templateUrl: 'templates/page.html',
    controller: 'pageCtrl'
  })
  
>>>>>>> 56d809fa6402ddec8182e0884066cd049badada3

 $urlRouterProvider.otherwise('/home')

});