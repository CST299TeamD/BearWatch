angular.module('app.controllers')

//Controller loaded when "Review Sessions" is selected"
.controller('reviewListCtrl', function($scope, $cordovaEmailComposer, $cordovaSQLite, $ionicPopup, $state, $location, Session) {

	//show/hide boolean for session list and session
	$scope.showList = true;

	//pie chart labels
	$scope.ff_labels = ["Pursuit for Food", "Green Vegetation", "Berries", "Human Food"];
	$scope.ni_labels = ["Loafing/Resting", "Sleeping", "Walking", "Running"];
	$scope.bbi_labels = ["Playing", "Fighting", "Defense"];

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
	            }
	        },
	        function(error) {
	            console.log("Error Found: " + error.message);
	        }
	    );
	});

	//function to show session details
	$scope.displaySession = function(session){
		//db test var - remove for production
		id = session.session_id;

		$scope.openSession = session;

		/***pie chart values***/

		//Feeding/Foraging
		var fp_total = 0;
		var gVeg_total = 0;
		var berries_total = 0;
		var hFood_total = 0;

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
                }
                $scope.ff_data = [(Math.floor(fp_total/1000)/60), (Math.floor(gVeg_total/1000)/60), (Math.floor(berries_total/1000)/60), (Math.floor(hFood_total/1000)/60)];
                $scope.ni_data = [(Math.floor(rest_total/1000)/60), (Math.floor(sleep_total/1000)/60), (Math.floor(walk_total/1000)/60), (Math.floor(run_total/1000)/60)];
                $scope.bbi_data = [(Math.floor(play_total/1000)/60), (Math.floor(fight_total/1000)/60), (Math.floor(defend_total/1000)/60)];
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
												$scope.showList = !$scope.showList;
												$state.go($state.current, {}, {reload: true});
								            },
								            function(error) {
								                console.log("Error Found: " + error);
								            }
								        );
						            },
						            function(error) {
						                console.log("Error Found: " + error);
						            }
						        );
				            },
				            function(error) {
				                console.log("Error Found: " + error);
				            }
				        );
		            },
		            function(error) {
		                console.log("Error Found: " + error);
		            }
		        );
			} 
		});
	};
	
	//Function to mail with attachments
	$scope.reviewSendPicture = function(id) {
		//Load a session and its data using its ID
		//Once loaded, build CSV files and push them to an array of attachments
		//Load all pictures from a CSV, push each one to the array of attachments
		//construct the email with its attachments and send it to the email application
		
		//instantiate array which holds all email attachments
		var csvAttachments = [];
		var pictureAttachments = [];
		var emailAttachments = [];
		
		Session.sessionReady = Session.foodReady = Session.logsReady = 0;//not ready
		try {
			Session.load(id);
		} catch(err) {
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
			
			if (Session.stationary == "Mobile"){
				data = data + 
					"\t" + Session.logs[Session.logs.length-1].utm_zone +
					"\t" + Session.logs[Session.logs.length-1].easting +
					"\t" + Session.logs[Session.logs.length-1].northing;
			}

			csvAttachments.push("base64:blockInformation.csv//" + btoa(data));

			//construct General Survey sheet
		
			data = "";
			
			var 
			bearID, bearName, accuracy, accuracyComments, animalInSight, urineStreamObserved, bearZone, bearSpecies, count, size, sex, age, marks, colour, colourVariation, furWet, pawMeasure, cubs, ageOfCubs, cubFur, bearComment, 
		
			studyAreaPhoto, commentType, generalComment, generalCommentType, bearsInPhoto, logTime, sessionDate, humanComment,
			
			aircraft, ATV, boat, vehicle, humanBehavior,
			
			habituation, feedingForaging, fishingTechnique, foragingDetails, numberOfFishCaught, nonInteractive, bearBearInteractions, bearHumanInteractions, humanBearInteractions, alertVigilance, actionOtherComment, fishingTechnique, foragingDetails, numberOfFishCaught = "";
			
			var lastBearComment = [];
			
			var date = new Date(Session.start_date);
				
			for (var i = 0; i<Session.logs.length;i++){
										
				//values to reset
				bearID = bearName = accuracy = accuracyComments = animalInSight = urineStreamObserved = bearZone = bearSpecies = count = size = sex = age = marks = colour = colourVariation = furWet = pawMeasure = cubs = ageOfCubs = cubFur = bearComment =

				studyAreaPhoto = generalComment = generalCommentType = humanComment = bearsInPhoto = logTime =
			
				aircraft = ATV = boat = vehicle = humanBehavior = 
			
				habituation = feedingForaging = fishingTechnique = foragingDetails = numberOfFishCaught = nonInteractive = bearBearInteractions = bearHumanInteractions = humanBearInteractions = alertVigilance = actionOtherComment = "";
			
				with (Session.logs[i]){
					
					logTime = new Date(timestamp);
					//sessionDate = (Session.start_date).split("/");
					
					//Handle Pictures
					if (picture_data != null){
						
						//logic to assign picture name //TDL monthnames may not be used
						var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug","Sep", "Oct", "Nov", "Dec"];
						//	BearWatch_Tweedsmuir-Park_June 21, 2016_22-24-37.jpg
						//Format: BearWatch_Tweedsmuir-Park_2016-Jun-9_13-30-32.jpg
						studyAreaPhoto = "BearWatch_" +
								(Session.park).trim().split(" ").join("-") + "_" +
								date.getUTCFullYear() + "-" +
								monthNames[date.getUTCMonth()] + "-" +
								date.getUTCDate() + "_" +
								logTime.getHours() + "-" +
								logTime.getMinutes() + "-" +
								logTime.getSeconds() + ".jpg";
						if (picture_subjects != null){
							bearsInPhoto = picture_subjects;
						}
						
						//Add picture data to picture array
						pictureAttachments.push("base64:" + studyAreaPhoto + "//" + picture_data);
											
					}
					
					//Handle ongoing environmental variables
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
						generalCommentType = generalComment = humanComment = "";
						commentType = comment_type.split("-")[0];
						if (commentType == "General" || commentType == "Picture"){
							generalComment = comment;
							generalCommentType = comment_type
						} else if (commentType == "Human"){
							humanComment = comment;
							generalCommentType = comment_type;					
						}
					}
						

					//Handle bears
					if (bear != null) {
						bear = angular.fromJson(bear);
						bearID = bear["id"];
						bearName = bear["name"];
						accuracy = bear["accuracy"];
						accuracyComments = bear["vAid"];
						animalInSight = bear["inSight"];
						if (bear["uStream"] == true){
							urineStreamObserved = "Yes";
						} else if (bear["uStream"] == false){
							urineStreamObserved = "No";
						} 
							
						bearZone = bear["zone"];
						//habituation handled in behaviors
						bearSpecies = bear["species"];
						size = bear["size"];
						count = parseInt(bear["cubs"] + 1) || 1;
						sex = bear["gender"];
						age = bear["age"];
						colour = bear["furColour"];
						colourVariation = bear["furCVariation"];
						furWet = bear["furCondition"];
						marks = bear["markDescription"];
						pawMeasure = bear["pawMeasured"];
						cubs = bear["cubs"];
						ageOfCubs = bear["cubAge"];
						cubFur = [];
						if(bear["CFCBlonde"]) cubFur.push("Blonde");
						if(bear["CBCLightBrown"]) cubFur.push("Light Brown");
						if(bear["CFCBrown"]) cubFur.push("Brown");
						if(bear["CFCDarkBrown"]) cubFur.push("Dark Brown");
						if(bear["CFCOther"]) cubFur.push("Other");
						
						if (lastBearComment[bear["id"]] != bear["comment"]) bearComment = lastBearComment[bear["id"]] = bear["comment"];

						for (j=0;j<bear["behaviour"].length;j++){
							
							switch(bear["behaviour"][j].category){
								case "Non-Interactive":
									nonInteractive = bear["behaviour"][j].description;
									break;
								case "Habituation":
									habituation = bear["behaviour"][j].description;
									break;
								case "Human-bear Interaction":
									humanBearInteractions = bear["behaviour"][j].description;
									break;
								case "Bear-human Interaction":
									bearHumanInteractions = bear["behaviour"][j].description;
									break;
								case "Bear-bear Interactive":
									bearBearInteractions = bear["behaviour"][j].description;
									break;
								case "Feeding or Foraging":
									feedingForaging = bear["behaviour"][j].description;
									break;
								case "Alert/Vigilance":
									alertVigilance = bear["behaviour"][j].description;
									break;
								case "Other":
									actionOtherComment = bear["behaviour"][j].description;
									break;										
							}
						}
					
						if (bear["isFishing"] == true){
							feedingForaging = "Fishing";							
							fishingTechnique = bear["fishingMethod"];
							foragingDetails = bear["fishingSuboption"];
							numberOfFishCaught = bear["tally"];
						}
								
						bear = "";
					} else {
						//no bear data this log
						bear = null;
						count = "0";
						bearName, accuracy,	accuracyComments, animalInSight, urineStreamObserved, bearZone, bearSpecies, size, sex, age, colour, colourVariation, furWet, marks, pawMeasure, cubs, ageOfCubs, cubFur, bearComment, habituation, feedingForaging, fishingTechnique, foragingDetails, numberOfFishCaught, nonInteractive, bearBearInteractions, bearHumanInteractions, alertVigilance, actionOtherComment = "";
					}
					
					//Handle humans
					if (human_count != null){
						var oldHumans = angular.fromJson(human_count);
						for (j=0;j<oldHumans.length;j++){
							if (oldHumans[j]["humans"] == null) {
								Session.humans[oldHumans[j]["zone"]] = "";
							} else {
								Session.humans[oldHumans[j]["zone"]] = oldHumans[j]["humans"];
							}
						}
						
						if (motorized_desc == null) {
							motorized_desc = "";
						} else {
							motorized_desc = motorized_desc + " ";
						}
						
						if (motorized_name == "" || motorized_name == null) {
						} else if (motorized_name.slice(0,3) == "ATV") {	
							ATV = motorized_desc + " " + motorized_name.slice(4,5) + " " + motorized_action;
						} else if (motorized_name.slice(0,4) == "Boat") {
							boat = motorized_desc + " " + motorized_name.slice(5,6) + " " + motorized_action;
						} else if (motorized_name.slice(0,7) == "Vehicle") {
							vehicle = motorized_desc + " " + motorized_name.slice(8,9) + " " + motorized_action;
						} else if (motorized_name.slice(0, 8) == "Aircraft") {
							aircraft = motorized_desc + " " + motorized_name.slice(9,10) + " " + motorized_action;
						}
						
						var oldHumans = angular.fromJson(human_type);
						for (j=0;j<oldHumans.length;j++){
							if (oldHumans[j]["checked"] == true) {
								Session.humanType[oldHumans[j]["type"]] = "Yes";
							} else {
								Session.humanType[oldHumans[j]["type"]] = "No";
							}
						}					
						humanBehavior = human_behavior;
					}
					
					//Handle human types
					data = data +
						Session.park + "\t" +
						Session.site + "\t" +
						Session.start_date + "\t" +	
						Session.start_time + "\t" +
						Session.finish_time + "\t" +
						Session.firstNameInitials + "\t" +
						Session.allNamesInitials + "\t" +
						Session.surveySched + "\t" +
						Session.observationMode + "\t" +
						Session.active + "\t" +
						Session.resting + "\t" +
						
						utm_zone + "\t" +
						easting + "\t" +
						northing + "\t" + 
			
						Session.viewingArea + "\t" +
						Session.zoneSchema + "\t" +
						Session.obsArea + "\t" +
						Session.comment + "\t" +
					
						Session.foodSources[0].food_source + "\t" +
						Session.foodSources[0].availability + "\t" +
						Session.foodSources[0].comment + "\t" + 
						Session.foodSources[1].food_source + "\t" +
						Session.foodSources[1].availability + "\t" +
						Session.foodSources[1].comment + "\t" + 
						Session.foodSources[2].food_source + "\t" +
						Session.foodSources[2].availability + "\t" +
						Session.foodSources[2].comment + "\t" +
						
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
						
						bearID + "\t" +
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
						
						logTime.toLocaleTimeString() + "\t" +
						
						animalInSight + "\t" +
						feedingForaging + "\t" +
						fishingTechnique + "\t" +
						foragingDetails + "\t" +
						numberOfFishCaught + "\t" +
						nonInteractive + "\t" +
						bearBearInteractions + "\t" +
						bearHumanInteractions + "\t" +
						humanBearInteractions + "\t" +
						alertVigilance + "\t" +
						actionOtherComment + "\t" +

						Session.humans["1b"] + "\t" +
						Session.humans["1a"] + "\t" +
						Session.humans["4+"] + "\t" +
						Session.humans["7a"] + "\t" +
						Session.humans["7b"] + "\t" +
						Session.humans["1+"] + "\t" +
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
					
						aircraft + "\t" +
						ATV + "\t" +
						boat + "\t" +
						vehicle + "\t" +
						
						Session.humanType['Angling'] + "\t" +
						Session.humanType['Boating'] + "\t" +
						Session.humanType['Hiking/Walking'] + "\t" +
						Session.humanType['Running'] + "\t" +
						Session.humanType['Picnicking'] + "\t" +
						Session.humanType['Photography'] + "\t" +
						Session.humanType['Playing'] + "\t" +
						Session.humanType['Wildlife Viewing'] + "\t" +
						Session.humanType['Biking'] + "\t" +
						Session.humanType['Unobservable'] + "\t" +
						Session.humanType['Other'] + "\t" +
						
						humanBehavior + "\t" +
						humanComment + "\t" +
						
						studyAreaPhoto + "\t" +
						bearsInPhoto + "\t" +
						Session.altMedia + "\t" +
						generalComment + "\t" +
						generalCommentType;
				
				}
			
				data = data + "\n";
			}
			csvAttachments.push("base64:generalSurvey.csv//" + btoa(data));
			
			for (j=0;j<csvAttachments.length;j++){				
				emailAttachments.push(csvAttachments[j]);
			}
			for (j=0;j<pictureAttachments.length;j++){						
				emailAttachments.push(pictureAttachments[j]);
			}
			
			Session.emailSubject = 'Bear Watch Email Submission: ' + Session.park + " " + Session.firstName;
			Session.emailBody = 'Session Details:' +
							'<br>Park: '+ Session.park +
							'<br>Site: '+ Session.site +
							'<br>All Surveyors: '+ Session.allNames +
							'<br>Sheet type: '+ Session.stationary +
							'<br><br>This email was automatically generated by the Bear Watch Application.';
			sendEmail(emailAttachments);
			Session.reset();

		}
	
		//Send (draft) email
		var sendEmail = function(emailAttachments){

			try{
				$cordovaEmailComposer.isAvailable().then(function() {
					var email = {
						to: 'BCParksConservation@gov.bc.ca',
						cc: '',
						attachments: emailAttachments,
						subject: Session.emailSubject,
						body: Session.emailBody,
						isHtml: true
					};

					$cordovaEmailComposer.open(email).then(null, function () {
					});
				}, function () {

				});
			} catch (exception){
				console.log("Error Found: " + exception.name + " ::: " + exception.message);
			}
		}
      
	}
});