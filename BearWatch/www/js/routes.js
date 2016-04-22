angular.module('app.routes', ['ionicUIRouter'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
   
   .state('app', {
	  url: "/page1",
	  abstract: true,
	  templateUrl: "templates/menu.html",
	})

  .state('scanningTabsController', {
    url: '/page1',
    templateUrl: 'templates/scanningTabsController.html',
    abstract:true
  })

  .state('scanningTabsController.bear', {
    url: '/page40',
    views: {
      'tab2': {
        templateUrl: 'templates/scanningBear.html',
        controller: 'focalCtrl'
      }
    }
  })
  
  .state('scanningTabsController.human', {
    url: '/page41',
    views: {
      'tab4': {
        templateUrl: 'templates/scanningHuman.html',
        controller: 'humanCtrl'
      }
    }
  })
  
  .state('scanningTabsController.environment', {
    url: '/page42',
    views: {
      'tab3': {
        templateUrl: 'templates/scanningEnvironment.html',
        controller: 'environmentCtrl'
      }
    }
  })
  
  .state('scanningTabsController.camera', {
    url: '/page43',
    views: {
      'tab1': {
        templateUrl: 'templates/scanningCamera.html',
        controller: 'cameraCtrl'
      }
    }
  })

  .state('scanningTabsController.comment', {
    url: '/page45',
    views: {
      'tab5': {
        templateUrl: 'templates/scanningComment.html',
        controller: 'cameraCtrl'
      }
    }
  })

  .state('focalTabsController.comment', {
    url: '/page46',
    views: {
      'tab5': {
        templateUrl: 'templates/focalComment.html',
        controller: 'cameraCtrl'
      }
    }
  })
  
  .state('focalTabsController.camera', {
    url: '/page10',
    views: {
      'tab1': {
        templateUrl: 'templates/focalCamera.html',
        controller: 'cameraCtrl'
      }
    }
  })

  .state('log41245PictureTaken', {
    url: '/page17',
    templateUrl: 'templates/log41245PictureTaken.html',
    controller: 'log41245PictureTakenCtrl'
  })

  .state('focalTabsController.environment', {
    url: '/page3',
    views: {
      'tab3': {
        templateUrl: 'templates/focalEnvironment.html',
        controller: 'environmentCtrl'
      }
    }
  })

  .state('focalTabsController', {
    url: '/page1',
    templateUrl: 'templates/focalTabsController.html',
    abstract:true
  })

  .state('start', {
    url: '/page2',
    templateUrl: 'templates/start.html',
    controller: 'startCtrl'
  })

  .state('log11234Bear1Spotted', {
    url: '/page15',
    templateUrl: 'templates/log11234Bear1Spotted.html',
    controller: 'log11234Bear1SpottedCtrl'
  })

  .state('newSessionObservers', {
    url: '/page6',
    templateUrl: 'templates/newSessionObservers.html',
    controller: 'newSessionObserversCtrl'
  })

  .state('reviewList', {
    url: '/page7',
    templateUrl: 'templates/reviewList.html',
    controller: 'reviewListCtrl'
  })

  .state('addComment', {
    url: '/page16',
    templateUrl: 'templates/addComment.html',
    controller: 'addCommentCtrl'
  })

  /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='focalTabsController.reviewSession'
      2) Using $state.go programatically:
        $state.go('focalTabsController.reviewSession');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /page1/tab2/page14
      /page1/tab4/page14
      /page1/tab3/page14
  */
  .state('focalTabsController.reviewSession', {
    url: '/page14',
    views: {
      'tab2': {
        templateUrl: 'templates/reviewSession.html',
        controller: 'reviewSessionCtrl'
      },
      'tab4': {
        templateUrl: 'templates/reviewSession.html',
        controller: 'reviewSessionCtrl'
      },
      'tab3': {
        templateUrl: 'templates/reviewSession.html',
        controller: 'reviewSessionCtrl'
      }
    }
  })

  .state('reviewSession2', {
    url: '/page25',
    templateUrl: 'templates/reviewSession2.html',
    controller: 'reviewSession2Ctrl'
  })

  .state('newSessionLocation', {
    url: '/page8',
    templateUrl: 'templates/newSessionLocation.html',
    controller: 'newSessionLocationCtrl'
  })

  .state('newSessionProtocolMode', {
    url: '/page10',
    templateUrl: 'templates/newSessionProtocolMode.html',
    controller: 'newSessionProtocolModeCtrl'
  })

  .state('newSessionEnvironmentVariables', {
    url: '/page11',
    templateUrl: 'templates/newSessionEnvironmentVariables.html',
    controller: 'newSessionEnvironmentVariablesCtrl'
  })

  .state('newSessionObserverSVisibility', {
    url: '/page18',
    templateUrl: 'templates/newSessionObserverSVisibility.html',
    controller: 'newSessionObserverSVisibilityCtrl'
  })

  .state('focalTabsController.bear1Specifications', {
    url: '/page23',
    views: {
      'tab2': {
        templateUrl: 'templates/bear1Specifications.html',
        controller: 'bear1SpecificationsCtrl'
      }
    }
  })

  .state('focalTabsController.addNewBear', {
    url: '/page22',
    views: {
      'tab2': {
        templateUrl: 'templates/addNewBear.html',
        controller: 'addNewBearCtrl'
      }
    }
  })

  .state('newSessionFoodSources', {
    url: '/page12',
    templateUrl: 'templates/newSessionFoodSources.html',
    controller: 'newSessionFoodSourcesCtrl'
  })

  .state('newSessionMode', {
    url: '/page20',
    templateUrl: 'templates/newSessionMode.html',
    controller: 'newSessionModeCtrl'
  })

  .state('additionalObservers', {
    url: '/page9',
    templateUrl: 'templates/additionalObservers.html',
    controller: 'additionalObserversCtrl'
  })

  .state('focalTabsController.focal', {
    url: '/page21',
    views: {
      'tab2': {
        templateUrl: 'templates/focalBear.html',
        controller: 'focalCtrl'
      }
    }
  })

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
      }
    }
  })

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
    views: {
      'tab2': {
        templateUrl: 'templates/bearHumanInteraction.html',
        controller: 'bearHumanInteractionCtrl'
      }
    }
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
  

$urlRouterProvider.otherwise('/page2')

  

});