angular.module('app.controllers')

//Controller loaded when "Review Sessions" is selected"
.controller('reviewListCtrl', function($scope, $cordovaEmailComposer, $cordovaSQLite, $ionicPopup, $state, $location, Session) {

	//show/hide boolean for session list and session
	$scope.showList = true;

	//pie chart labels
	$scope.ff_labels = ["Pursuit for Food", "Green Vegetation", "Berries", "Human Food", "Fishing"];
	$scope.ni_labels = ["Loafing/Resting", "Sleeping", "Walking", "Running"];
	$scope.bbi_labels = ["Alert/Vigilance", "Playing", "Fighting", "Defense"];

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
		console.log("new display, id: " + id);

		$scope.openSession = session;

		/***pie chart values***/

		//Feeding/Foraging
		var fp_total = 0;
		var gVeg_total = 0;
		var berries_total = 0;
		var hFood_total = 0;
		var fishn_total = 0;

		//Non-interactive
		var rest_total = 0;
		var sleep_total = 0;
		var walk_total = 0;
		var run_total = 0;

		//Bear-Bear Interactive
		var alert_total = 0;
		var play_total = 0;
		var fight_total = 0;
		var defend_total = 0;
		
		//get pie chart values
	  	$cordovaSQLite.execute(db, 'SELECT bear FROM logs WHERE session_id = (?)', [id])
        .then(
            function(result) {
                if (result.rows.length > 0) {
                	for (var i = 0; i < result.rows.length; i++){
	        			for(item in result.rows.item(i)){
	        				//get the bear
	        				bear = angular.fromJson(result.rows.item(i)[item]);
	        				if(bear != null){
	        					for(var j = 0; j < bear.behaviour.length; j++){
	        						//get the behavior and add to total at end time
	        						var behaviour = angular.fromJson(bear.behaviour[j]);
	        						if(behaviour.endTime != ''){
	        							var start = new Date(behaviour.time);
	        							var end = new Date(behaviour.endTime);
	        							var total = (end - start);
	        							switch(behaviour.description){
	        								case "Pursuit for food":
	        									fp_total += total;
	        									break;
	        								case "Green Vegetation":
	        									gVeg_total += total;
	        									break;
	        								case "Berries":
	        									berries_total += total;
	        									break;
	        								case "Human Food":
	        									hFood_total += total;
	        									break;
	        								case "Fishing":
	        									fishn_total += total;
	        									break;
	        								case "Loafing/Resting":
	        									rest_total += total;
	        									break;
	        								case "Sleeping":
	        									sleep_total += total;
	        									break;
	        								case "Walking":
	        									walk_total += total;
	        									break;
	        								case "Running":
	        									run_total += total;
	        									break;
	        								case "Alert/Vigilance":
	        									alert_total += total;
	        									break;
	        								case "Playing":
	        									play_total += total;
	        									break;
	        								case "Fighting":
	        									fight_total += total;
	        									break;
	        								case "Defense":
	        									defend_total += total;
	        									break;
	        							}
		        					}
		        				}
	        				}
	        			}
	        		}
                }else{
                	console.log("No bear results");
                }
                $scope.ff_data = [Math.floor(fp_total/1000), Math.floor(gVeg_total/1000), Math.floor(berries_total/1000), Math.floor(hFood_total/1000), Math.floor(fishn_total/1000)];
                $scope.ni_data = [Math.floor(rest_total/1000), Math.floor(sleep_total/1000), Math.floor(walk_total/1000), Math.floor(run_total/1000)];
                $scope.bbi_data = [Math.floor(alert_total/1000), Math.floor(play_total/1000), Math.floor(fight_total/1000), Math.floor(defend_total/1000)];
            },
            function(error) {
                $scope.selectResult = "Error bear select: " + error.message;
            }
        );

		$scope.showList = !$scope.showList;
	};

	//function to toggle graph display
	$scope.type = 'Pie';
	$scope.toggleGraph = function () {
    	$scope.type = $scope.type === 'Pie' ? 'PolarArea' : 'Pie';
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
	
	//Function to mail with attachments
	$scope.reviewSendPicture = function(id) {
		//Load a session and its data using its ID
		//Once loaded, build CSV files and push them to an array of attachments
		//Load all pictures from a CSV, push each one to the array of attachments
		//construct the email with its attachments and send it to the email application
		
		//instantiate array which holds all email attachments
		var emailAttachments = [];
		var pictureAttachments = [];

		Session.sessionReady = Session.foodReady = Session.logsReady = 0;//not ready
		try {
			Session.load(id);
		} catch(err) {
			console.log("An exception occurred and was caught");
			alert("Unable to load session from SQLiteDatabase. Error:\n" + err.message);
			Session.sessionReady = 2;
		}
		var sessionLoadInterval = setInterval(function(){		
			if(Session.sessionReady != 0){
				if(Session.sessionReady == 1 && Session.logsReady == 1 && Session.foodReady == 1){
					buildAttachments();
					clearInterval(sessionLoadInterval);
				} else if (Session.sessionReady == 2 || Session.logsReady == 2 || Session.foodReady == 2){
					alert("Unable to load session from database");
					clearInterval(sessionLoadInterval);
				}
			}
		}, 100);
	
		var buildAttachments = function(){
			
			var data;
			
			//construct Block Information sheet
			//header = "Study Area Name\tBlock Label\tUTM Zone Block\tEasting Block\tNorthing Block";
			data = Session.park + "\t" + Session.site + "\t" + Session.logs[0].utm_zone + "\t" + Session.logs[0].easting + "\t" + Session.logs[0].northing;
			emailAttachments.push("base64:blockInformation.csv//" + btoa(data));

			//construct General Survey sheet
		
			data = "";
			
			var bearName, accuracy, accuracyComments, animalInSight, urineStreamObserved, bearZone, bearSpecies, count, size, sex, age, marks, colour, colourVariation, furWet, pawMeasure, cubs, ageOfCubs, cubFur, bearComment, lastBearComment, habituation, feedingForaging, nonInteractive, bearBearInteractions, bearHumanInteractions, studyAreaPhoto, fishingTechnique, foragingDetails, numberOfFishCaught, alertVigilance, actionOtherComment= "";
				
			for (var i = 0; i<Session.logs.length;i++){
				//console.log("log start: "+i+"/"+Session.logs.length);
													
				//values to reset
				bearName = accuracy = accuracyComments = animalInSight = urineStreamObserved = bearZone = bearSpecies = count = size = sex = age = marks = colour = colourVariation = furWet = pawMeasure = cubs = ageOfCubs = cubFur = habituation = feedingForaging = nonInteractive = bearBearInteractions = bearHumanInteractions = bearComment = studyAreaPhoto = fishingTechnique = foragingDetails = numberOfFishCaught = alertVigilance = actionOtherComment= "";
				with (Session.logs[i]){
					
					//Handle Pictures
					if (picture_data != null){
						studyAreaPhoto = "picture"+i+".jpg";
						//logic to assign picture name to a "photo" field
						pictureAttachments.push("base64:picture"+i+".jpg//" + picture_data);
					}
					
					//Handle ongoing environmental variables
					if (water_body != null) Session.water_body = water_body;
					if (water_level != null) Session.water_level = water_level;
					if (water_clarity != null) Session.water_clarity = water_clarity;
					
					if (cloud_cover != null) Session.cloud_cover = cloud_cover;
					if (precipitation  != null) Session.precipitation = precipitation;
					if (wind != null) Session.wind = wind;
					if (wind_direction != null) Session.wind_direction = wind_direction;
					
					if (temperature != null) Session.temperature = temperature;
					if (humididty != null) Session.humididty = humididty;
					
					if (noise_level != null) Session.noise_level = noise_level;					
					if (visibility != null) Session.visibility = visibility;
					if (obstruction != null) Session.obstruction = obstruction;
					
					//Handle Comments
					if (comment != null && comment != "" && (comment != humanComment || comment != generalComment)){
						if (comment_type.slice(0, 7) == "General"){
							humanComment = "";
							generalComment = comment;
						} else if (comment_type.slice(0, 5) == "Human"){
							humanComment = comment;
							generalComment = "";	
						}
					} else {
						humanComment = "";
						generalComment = "";	
					}
						

					//Handle bears
					//console.log(bear);
					var bearUpdated = "";
					if (bear != null) {
						bearUpdated = "true";
						bear = angular.fromJson(bear);
						bearName = bear["name"];
						accuracy = '';
						accuracyComments = '';
						animalInSight = '';
						urineStreamObserved = '';
						bearZone = bear["zone"];
						//habituation handled in behaviors
						bearSpecies = bear["species"];
						size = bear["size"];
						if (parseInt(bear["cubs"]) != "NaN") {
							count = 1+parseInt(bear["cubs"]);
						} else {
							count = 1;
						};
						sex = bear["gender"];
						age = bear["age"];
						colour = bear["furColour"];
						colourVariation = "";
						furWet = "";
						marks = bear["markDescription"];
						pawMeasure = bear["pawMeasured"];
						cubs = bear["cubs"];
						ageOfCubs = bear["cubAge"];
						cubFur = bear["cubFurColour"];
						if (lastBearComment != bear["comment"]) {bearComment = lastBearComment = bear["comment"];}

							
						
							habituation,
							feedingForaging,
							fishingTechnique,
							foragingDetails,
							numberOfFishCaught,
							nonInteractive,
							bearBearInteractions,
							bearHumanInteractions,
							alertVigilance,
							actionOtherComment = "";
						/*
						if (bear["behavior"] != "undefined" && bear["behavior"] != null){
							var behavior = angular.fromJson(bear["behavior"]);
							var fishing = angular.fromJson(bear["fishing"]);
							console.log("************************");
							
							feedingForaging
							fishingTechnique
							foragingDetails
							numberOfFishCaught
							nonInteractive
							bearBearInteractions
							bearHumanInteractions
							alertVigilance
							actionOtherComment
							
						}*/
						bear = "";
					} else {
						//no bear data this log
						bearUpdated = "false";
						bear = null;
						count = "0";
						bearName, accuracy,	accuracyComments, animalInSight, urineStreamObserved, bearZone, bearSpecies, size, sex, age, colour, colourVariation, furWet, marks, pawMeasure, cubs, ageOfCubs, cubFur, bearComment, habituation, feedingForaging, fishingTechnique, foragingDetails, numberOfFishCaught, nonInteractive, bearBearInteractions, bearHumanInteractions, alertVigilance, actionOtherComment = "";
					}
					
					//Handle human zones
					if (human_count != null){
						var oldHumans = angular.fromJson(human_count);
						for (j=0;j<oldHumans.length;j++){									
							Session.humans[oldHumans[j]["zone"]] = oldHumans[j]["humans"];
						}
						//stringify? console.log(oldHumans);
						//console.log(humans);
					}
					
					data = data +
						Session.park + "\t" +
						Session.site + "\t" +
						Session.start_date + "\t" +	
						Session.start_time + "\t" +
						Session.finish_time + "\t" +
						Session.firstName + "\t" +
						
						utm_zone + "\t" +
						easting + "\t" +
						northing + "\t" + 
			
						Session.viewingArea + "\t" +
						Session.zoneSchema + "\t" +
						Session.obsArea + "\t" +
						Session.comment + "\t" +
						Session.observationMode + "\t" +
					
						Session.foodSources[0].food_source + "\t" +
						Session.foodSources[0].availability + "\t" +
						Session.foodSources[0].comment + "\t" + 
						Session.foodSources[1].food_source + "\t" +
						Session.foodSources[1].availability + "\t" +
						Session.foodSources[1].comment + "\t" + 
						Session.foodSources[2].food_source + "\t" +
						Session.foodSources[2].availability + "\t" +
						Session.foodSources[2].comment + "\t" +
						
						Session.water_body + "\t" +
						"Need to talk to Chris" + "\t" +
						Session.water_level + "\t" +
						Session.water_clarity + "\t" +
						
						Session.cloud_cover + "\t" +
						Session.precipitation + "\t" +
						Session.wind + "\t" +
						Session.wind_direction + "\t" +
						
						Session.temperature + "\t" +
						Session.humididty + "\t" +
						
						Session.visibility + "\t" +
						Session.obstruction + "\t" +
						Session.noise_level + "\t" +
						
						bearName + "\t" +						
						accuracy + "\t" +
						accuracyComments + "\t" +
						urineStreamObserved + "\t" +
						bearZone + "\t" +
						habituation + "\t" +
						bearSpecies + "\t" +
						size + "\t" +
						count + "\t" +
						sex + "\t" +
						age + "\t" +
						colour + "\t" +
						colourVariation + "\t" +
						furWet + "\t" +
						marks + "\t" +
						pawMeasure + "\t" +
						cubs + "\t" +
						ageOfCubs + "\t" +
						cubFur + "\t" +
						bearComment + "\t" +
						
						//new Date(timestamp).toLocaleTimeString() + "\t" +
						
						bearUpdated + "\t" +
						
						animalInSight + "\t" +
						feedingForaging + "\t" +
						fishingTechnique + "\t" +
						foragingDetails + "\t" +
						numberOfFishCaught + "\t" +
						nonInteractive + "\t" +
						bearBearInteractions + "\t" +
						bearHumanInteractions + "\t" +
						alertVigilance + "\t" +
						actionOtherComment + "\t" +

						Session.humans["1b"] + "\t" +
						Session.humans["1a"] + "\t" +
						Session.humans["4+"] + "\t" +
						Session.humans["7a"] + "\t" +
						Session.humans["7b"] + "\t" +
						Session.humans["+1"] + "\t" +
						Session.humans["1"] + "\t" +
						Session.humans["4"] + "\t" +
						Session.humans["7"] + "\t" +
						Session.humans["7+"] + "\t" +
						Session.humans["2+"] + "\t" +
						Session.humans["2"] + "\t" +
						Session.humans["5"] + "\t" +
						Session.humans["8"] + "\t" +
						Session.humans["8+"] + "\t" +
						Session.humans["3+"] + "\t" +
						Session.humans["3"] + "\t" +
						Session.humans["6"] + "\t" +
						Session.humans["9"] + "\t" +
						Session.humans["9+"] + "\t" +
						Session.humans["3b"] + "\t" +
						Session.humans["3a"] + "\t" +
						Session.humans["6+"] + "\t" +
						Session.humans["9a"] + "\t" +
						Session.humans["9b"] + "\t" +
					
						"aircraft" + "\t" +
						"ATC" + "\t" +
						"motorized boat" + "\t" +
						"vehicle" + "\t" +
						"official or agency boat" + "\t" +
						"angling" + "\t" +
						
						"kayak/canoeing" + "\t" +
						"hike/walking" + "\t" +
						"running" + "\t" +
						"picnic" + "\t" +
						"photography" + "\t" +
						"playing" + "\t" +
						"wildlife viewing" + "\t" +
						"biking" + "\t" +
						"unobservable" + "\t" +
						"other" + "\t" +
						
						"human behaviour (worst if in a group)" + "\t" +
						humanComment + "\t" +
						
						studyAreaPhoto + "\t" +
						generalComment;
				
				}
			
				data = data + "\n";
			}
			emailAttachments.push("base64:generalSurvey.csv//" + btoa(data));
			
			//emailAttachments.concat(pictureAttachments);
			sendEmail(id, emailAttachments);

		}
/*
		var getPictures = function(sessionID){
			//Add to pictures attachment array
			var query = "SELECT log_id, picture_data FROM logs WHERE session_id = "+sessionID+" AND picture_data IS NOT NULL";
			$cordovaSQLite.execute(db, query).then(
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
					}					
					$scope.pictureAttachmentsStatus = 1;
				},
				function(error) {
					//TODO - GIVE USER FEEDBACK
					console.log("Error on loading pictures: " + error.message);	
					$scope.pictureAttachments = 2;
				}
			);
		}
*/
	
		//Send (draft) email
		var sendEmail = function(sessionID, emailAttachments){
			console.log("...attempting to send email with " + emailAttachments.length + " attachments");
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
						isHtml: true
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

		var attachCSVs = function(emailAttachments){

			var csvContents;

			csvContents = btoa($scope.siteIncidentalObservationsHeader + "\n" + $scope.siteIncidentalObservationsData);
			emailAttachments.push('base64:SiteIncidentalObservations.csv//'+csvContents);
		
			csvContents = btoa($scope.generalSurveyHeader + "\n" + $scope.generalSurveyData);
			emailAttachments.push('base64:GeneralSurvey.csv//'+csvContents);

			csvContents = btoa($scope.blockInformationHeader + "\n" + $scope.blockInformationData);
			emailAttachments.push('base64:blockInformation.csv//'+csvContents);

			csvContents = btoa($scope.projectInformationHeader + "\n" + $scope.projectInformationData);
			console.log("csvContents: "+$scope.projectInformationHeader + "\n" + $scope.projectInformationData);
			emailAttachments.push('base64:ProjectInformation.csv//'+csvContents);
		}
		

        
	}
});