angular.module('app.controllers')

//Controller loaded when "Review Sessions" is selected"
.controller('reviewListCtrl', function($scope, $cordovaEmailComposer, $cordovaSQLite, $ionicPopup, $state, $location) {

	//show/hide boolean for session list and session
	$scope.showList = true;

	//function to populate sessions list
	$scope.sessionList = [];
	$scope.$on('$ionicView.enter', function() {
		$cordovaSQLite.execute(db, 'SELECT * FROM sessions')
	    .then(
	        function(result) {
	            if (result.rows.length > 0) {
	            	for (var i = 0; i < result.rows.length; i++){
	            		var session = {};
	        			for(item in result.rows.item(i)){
	        				session[item] = result.rows.item(i)[item];
	        			}
	        			$scope.sessionList.push(session);
	        		}
	            }else{
	            	console.log("No sessions returned");
	            }
	        },
	        function(error) {
	            console.log("Error on sessions SELECT: " + error.message);
	        }
	    );
	});

	//function to show session details
	$scope.displaySession = function(session){
		//db test var - remove for production
		id = session.session_id;

		$scope.openSession = session;
		
		/*pie chart values*/

		//feeding foraging - number of logs for each behavior
		$scope.feedForageLabels = ["Pursuit for Food", "Green Vegetation", "Berries", "Human Food", "Fishing"];
	  	$scope.ff_data = [];
	  	$scope.ff_type = 'FeedForage';
	  	$cordovaSQLite.execute(db, 'SELECT bear FROM logs WHERE session_id = (?)', [id])
        .then(
            function(result) {
                if (result.rows.length > 0) {
                	for (var i = 0; i < result.rows.length; i++){
	        			for(item in result.rows.item(i)){
	        				//console.log(result.rows.item(i)[item]);
	        				bear = angular.fromJson(result.rows.item(i)[item]);
	        				if(bear != null){
	        					for(var j = 0; j < bear.behaviour.length; j++){
	        						var behaviour = angular.fromJson(bear.behaviour[j]);
        						if(behaviour.endTime != ''){
        							//TODO:
	        					}
	        				}
	        			}
	        			//update values
	        		}
                }else{
                	console.log("No bear results")
                }
            },
            function(error) {
                $scope.selectResult = "Error bear select: " + error.message;
            }
        );

		$scope.showList = !$scope.showList;
	};

	//function to close open session
	$scope.closeSession = function(){
		$scope.showList = !$scope.showList;
	};

	//function to remove session info from DB
	$scope.removeSession = function(id){
		console.log(id);
		var confirmPopup = $ionicPopup.confirm({
			title: 'Delete Session',
			template: '<h1>Warning</h1> <p>This will permanently remove all data associated with this session, are you sure?</p>',
			cssClass: 'commentPopup'

		});

	   confirmPopup.then(function(res) {
			if(res) {
				//remove from DB
				$cordovaSQLite.execute(db, 'DELETE FROM sessions WHERE session_id = (?)', [id])
		        .then(
		            function(result) {
						$cordovaSQLite.execute(db, 'DELETE FROM bears WHERE session_id = (?)', [id])
				        .then(
				            function(result) {
								$cordovaSQLite.execute(db, 'DELETE FROM logs WHERE session_id = (?)', [id])
						        .then(
						            function(result) {
										$cordovaSQLite.execute(db, 'DELETE FROM food_sources WHERE session_id = (?)', [id])
								        .then(
								            function(result) {
												console.log("session delete success");
												$scope.showList = !$scope.showList;
												$state.go($state.current, {}, {reload: true});
								            },
								            function(error) {
								                $scope.selectResult = "Error on food_sources delete: " + error.message;
								            }
								        );
						            },
						            function(error) {
						                $scope.selectResult = "Error on logs delete: " + error.message;
						            }
						        );
				            },
				            function(error) {
				                $scope.selectResult = "Error on bears delete: " + error.message;
				            }
				        );
		            },
		            function(error) {
		                $scope.selectResult = "Error on session delete: " + error.message;
		            }
		        );
			} 
		});
	};

	//pie chart function
	$scope.labels = ["Pursuit for Food", "Berries", "Human Food"];
  	$scope.data = [30, 50, 10];
  	$scope.type = 'PolarArea';

    $scope.toggleGraph = function () {
      $scope.type = $scope.type === 'PolarArea' ? 'Pie' : 'PolarArea';
    };


	
	//logging test field
	var id = '';
	$scope.testSelect = function(){
		$scope.insertResult = "Initialized: Session_id?:  " + id;

        $cordovaSQLite.execute(db, 'SELECT * FROM logs WHERE session_id = (?)', [id])
        .then(
            function(result) {
            	$scope.selectResult = "Logs = ";
                if (result.rows.length > 0) {
                	console.log("enviro results returned");
                	for (var i = 0; i < result.rows.length; i++){
	        			for(item in result.rows.item(i)){
	        				$scope.selectResult += item + ": " + result.rows.item(i)[item] + ", ";
	        			}
	        			$scope.selectResult += "   *******New Entry******   ";
	        		}
                }else{
                	console.log("No enviro results")
                }
            },
            function(error) {
                $scope.selectResult = "Error on loading: " + error.message;
            }
        );

        $cordovaSQLite.execute(db, 'SELECT * FROM food_sources WHERE session_id = (?)', [id])
        .then(
            function(result) {
            	$scope.foodResult = "food sources = ";
                if (result.rows.length > 0) {
                	console.log("enviro results returned");
                	for (var i = 0; i < result.rows.length; i++){
	        			for(item in result.rows.item(i)){
	        				$scope.foodResult += item + ": " + result.rows.item(i)[item] + ", ";
	        			}
	        			$scope.foodResult += "   *******New Entry******   ";
	        		}
                }else{
                	console.log("No food source results")
                }
            },
            function(error) {
                $scope.selectResult = "Error on loading: " + error.message;
            }
        );
	}

	//$scope.result = '...starting reviewListCtrl';
	document.addEventListener("deviceready", onDeviceReady, false);

	function onDeviceReady() {
		//$scope.result += ('...dataDirectory: '+cordova.file.dataDirectory);
		
	}	
	
	//Function to mail with attachments
	$scope.reviewSendPicture = function() {

		//instantiate array which holds all email attachments
		var emailAttachments = []

		//Add CSV(s) to array of emailAttachments
		//place holder -- this should actually be a huge text CSV with an entire session of data
		var csv1contents = "Hello, World, Of, Bears"
		emailAttachments.push('base64:csv1.csv//'+btoa(csv1contents));


		//Add to pictures attachment array TODO - specify session
		$scope.selectResult = "Initialized";
        $cordovaSQLite.execute(db, "SELECT log_id, picture_data FROM logs").then(
            function(result) {
                $scope.selectResult += "...Select successful! Rows length = " + result.rows.length;
                if (result.rows.length > 0) {
                    $scope.fileName = "Select successful!";
                    var i=0;
                    while(i < result.rows.length){
                    	$scope.selectResult += "...log_id: "+result.rows.item(i).log_id;
                    	emailAttachments.push("base64:picture"+i+".jpg//" + result.rows.item(i).picture_data);
                    	i++;
                    }
                } else {
                	$scope.selectResult += "...No rows found"
                }
            },
            function(error) {
            	//TODO - GIVE USER FEEDBACK
                $scope.selectResult = "Error on loading: " + error.message;
            }
        );

        //Send (draft) email
		$scope.mailProgress = "...attempting to send email with " + emailAttachments.length + " attachments";
		try{
			$cordovaEmailComposer.isAvailable().then(function() {
				$scope.mailProgress = "...Email is available";
				var email = {
					//TODO - set proper email & mail contents
					to: 'cobbsworth@outlook.com',
					cc: '',
					attachments: emailAttachments,
					subject: 'Cordova Email',
					body: '',
					isHtml: false
				};

				$cordovaEmailComposer.open(email).then(null, function () {
				   //$scope.mailProgress = "...Email Cancelled";
				});
			}, function () {
			   $scope.mailProgress = "...Email is unavailable";
			});
		} catch (exception){
			$scope.mailProgress = exception.name + " ::: " + exception.message;
		}
	}
});