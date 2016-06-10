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
			$scope.blockInformationHeader = 
			$scope.blockInformationData = 		
			$scope.siteIncidentalObservationsHeader = 
			$scope.siteIncidentalObservationsData = 
			$scope.generalSurveyHeader = 
			$scope.GeneralSurveyData = '';

			$scope.blockInformationStatus =
			$scope.siteIncidentalObservationsStatus =
			$scope.generalSurveyStatus =
			$scope.pictureAttachmentsStatus = 0;

			var header;
			var data;
			//construct Project Information sheet
			header = "SPI Project ID\tProject Name\t Survey Name";
			data = "SPI12345\tBearWatch\t" + Session.park + " " + Session.observers + " " + Session.start_time;
			emailAttachments.push("base64:projectInformation.csv//" + btoa(header+"\n"+data));

			//construct Block Information sheet
			header = "Study Area Name\tStudy Area Photos\tBlock Label\tUTM Zone Block\tEasting Block\tNorthing Block\tBlock Area (sq m)\tBlock Comments\tBlock Photos";
			data = Session.park_site + "\t" + "which photos?" + "\t" + "What is Block Label?" + "\t" + Session.logs[0].utm_zone + "\t" + Session.logs[0].easting + "\t" + Session.logs[0].northing + "\t" + "What is Block Area? " + "\t" + "What are Block Comments?" + "\t" + "What are Block Photos?"
			emailAttachments.push("base64:blockInformation.csv//" + btoa(header+"\n"+data));

			//construct General Survey sheet
			header = 
			"Study Area Name" + "\t" +
			"Block Label" + "\t" +
			"Date" + "\t" +	
			"Start Time" + "\t" +
			"End Time" + "\t" +
			"Viewing Situation (river, estuary or terrestrial)" + "\t" +
			"Stationary or Mobile" + "\t" +
			"Zone type" + "\t" +
			"Comment" + "\t" +
			"Surveyor" + "\t" +
			"Cloud cover" + "\t" +
			"Precipiation" + "\t" +
			"Wind" + "\t" +
			"Wind direction" + "\t" +
			"Temperature (C )" + "\t" +
			"humididty" + "\t" +
			"Visibility" + "\t" +
			"Reason for obscured visibility" + "\t" +
			"Noise" + "\t" +
			"Fish abundance" + "\t" +
			"Berry abundance" + "\t" +
			"Green vegetation abundance" + "\t" +
			"Other" + "\t" +
			"Comment (fish species or other)" + "\t" +
			"Monitoring method (focal or scan)" + "\t" +
			"Bear id" + "\t" +
			"zone" + "\t" +
			"Species" + "\t" +
			"Count" + "\t" +
			"Size" + "\t" +
			"Sex" + "\t" +
			"Age" + "\t" +
			"Marks" + "\t" +
			"Colour" + "\t" +
			"Time" + "\t" +
			"Paw measurement? (Y or N)" + "\t" +
			"Number of cubs" + "\t" +
			"Age of cubs" + "\t" +
			"Cub fur colour" + "\t" +
			"Bear comments" + "\t" +
			"Habituation to humans" + "\t" +
			"Feeding/foraging" + "\t" +
			"Non-interactive" + "\t" +
			"Bear-bear interactions" + "\t" +
			"Bear-human interactions" + "\t" +
			"zone 1b" + "\t" +
			"zone 1a" + "\t" +
			"zone 4+" + "\t" +
			"zone 7a" + "\t" +
			"zone 7b" + "\t" +
			"zone 1+" + "\t" +
			"zone 1" + "\t" +
			"zone 4" + "\t" +
			"zone 7" + "\t" +
			"zone 7+" + "\t" +
			"zone 2+" + "\t" +
			"zone 2" + "\t" +
			"zone 5" + "\t" +
			"zone 8" + "\t" +
			"zone 8+" + "\t" +
			"zone 3+" + "\t" +
			"zone 3" + "\t" +
			"zone 6" + "\t" +
			"zone 9" + "\t" +
			"zone 9+" + "\t" +
			"zone 3b" + "\t" +
			"zone 3a" + "\t" +
			"zone 6+" + "\t" +
			"zone 9a" + "\t" +
			"zone 9b" + "\t" +
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
			"human behaviour comment" + "\t" +
			"Survey Observation Photos" + "\t" +
			"General Comments";
			
			data = "";
			
			//FOOD SOURCES
			var fishAbundance, berryAbundance, greenVegetationAbundance, other = '';
			for (var i = 0; i<Session.foodSources.length;i++){
				fishAbundance = "";
				berryAbundance = "";
				greenVegetationAbundance = "";
				other = "";
				with (Session.foodSources[i]){
					switch (food_source){
							case "Fish":
								fishAbundance = availability;
								break;
							case "Berries":
								berryAbundance = availability;
								break;
							case "Green Vegetation":
								greenVegetationAbundance = availability;
								break;
							default:
								other = availability;
					}

					data = data +				
						Session.park_site + "\t" +
						"What is Block Label?" + "\t" +
						Session.start_date + "\t" +	
						Session.start_time + "\t" +
						Session.finish_time + "\t" +
						Session.viewing_area + "\t" +
						Session.stationary + "\t" +
						Session.zoneSchema + "\t" +
						Session.comment + "\t" +
						Session.firstName + "\t" +
						"\t" + "\t" + "\t" + "\t" + "\t" + "\t" + "\t" + "\t" + "\t" +
						fishAbundance + "\t" +
						berryAbundance + "\t" +
						greenVegetationAbundance + "\t" +
						other + "\t" +
						comment + "\t" +
						Session.observationMode + "\t" + "\t" + "\t" + "\t" +
						"0" +  "\t" +  "\t" +  "\t" +  "\t" +  "\t" +  "\t" + //count
						Session.start_time; 
				
				}
				
				data = data + "\n";
			}
			
			//TIME BASED LOGS
			humans = {"1b" : "", "1a" : "", "4p" : "", "7a" : "", "7b" : "", "1p" : "", "1" : "", "4" : "", "7" : "", "7p" : "", "2p" : "", "2" : "", "5" : "", "8" : "", "8p" : "", "3p" : "", "3" : "", "6" : "", "9" : "", "9p" : "", "3b" : "", "3a" : "", "6p" : "", "9a" : "", "9b" : ""};
		
			for (var i = 0; i<Session.logs.length;i++){
				console.log("log start: "+i+"/"+Session.logs.length);
					
				var bearName, bearZone, species, count, size, sex, age, marks, colour, pawMeasure, cubs, ageOfCubs, cubFur, bearComment, habituation, feedingForaging, nonInteractive, bearBearInteractions, bearHumanInteractions = "";
				with (Session.logs[i]){
					//Handle Pictures
					surveyObservationPhoto = "";
					blockPhoto = "";
					studyAreaPhoto = "";	
					if (picture_data != 'null'){
							pictureAttachments.push("base64:picture"+i+".jpg//" + picture_data);
							//logic to assign picture name to a "photo" field
					}

					//Handle Comments
					humanComment = "";
					generalComment = "";
					if (comment != null && comment != ""){
						if (comment_type.slice(0, 7) == "General"){
							generalComment = comment;
						} else if (comment_type.slice(0, 5) == "Human"){
							humanComment = comment;
						}
					}
					
					//Handle ongoing environmental variables
					if (cloud_cover != null) Session.cloud_cover = cloud_cover;
					if (precipitation  != null) Session.precipitation = precipitation;
					if (wind != null) Session.wind = wind;
					if (wind_direction != null) Session.wind_direction = wind_direction;
					if (temperature != null) Session.temperature = temperature;
					if (humididty != null) Session.humididty = humididty;
					if (noise_level != null) Session.noise_level = noise_level;					
					if (visibility != null) Session.visibility = visibility;
					if (obstruction != null) Session.obstruction = obstruction;
					
					//Handle bears
					if (bear != null && bear != [] && bear != "null" && bear != "undefined") {
						bear = angular.fromJson(bear);
						bearName = bear["name"];
						bearZone = bear["zone"];
						species = bear["species"];
						count = 1+parseInt(bear["cubs"]);
						size = bear["size"];
						sex = bear["gender"];
						age = bear["age"];
						marks = bear["markDescription"];
						colour = bear["furColour"];
						pawMeasure = bear["pawMeasured"];
						cubs = bear["cubs"];
						ageOfCubs = bear["cubAge"];
						cubFur = bear["cubFurColour"];
						bearComment = bear["comment"];
						if (bear["behavior"] != "undefined" && bear["behavior"] != null){
							var behavior = angular.fromJson(bear["behavior"]);
							var fishing = angular.fromJson(bear["fishing"]);
							console.log("************************");
							console.log(bear["behavior"]);
							console.log("************************");
							console.log(bear["fishing"]);
							console.log("************************");
							//habituation = behavior["habituation"];
							//feedingForaging = behavior["habituation"];
							//nonInteractive = behavior["habituation"];
							//bearBearInteractions = behavior["habituation"];
							//bearHumanInteractions = behavior["habituation"];
						}
					} else {					
						bearName = "";
						sex = "";
						bearZone = "";
						species = "";
						count = "0";
						size = "";
						sex = "";
						age = "";
						marks = "";
						colour = "";
						pawMeasure = "";
						cubs = "";
						ageOfCubs = "";
						cubFur = "";
						bearComment = "";
						habituation = "";
						feedingForaging = "";
						nonInteractive = "";
						bearBearInteractions = "";
						bearHumanInteractions = "";						
					}
					
					//Handle human zones
					if (human_count != null){
						var humans = [];
						var oldHumans = angular.fromJson(human_count);
						for (j=0;j<oldHumans.length;j++){									
							humans[oldHumans[j]["zone"]] = oldHumans[j]["humans"];
						}
						Session.humans = humans;
						console.log(oldHumans);
						console.log(humans);
					}
									
					
					//Write the data
					data = data +				
					Session.park_site + "\t" +
					"What is Block Label?" + "\t" +
					Session.start_date + "\t" +	
					Session.start_time + "\t" +
					Session.finish_time + "\t" +
					Session.viewing_area + "\t" +
					Session.stationary + "\t" +
					Session.zoneSchema + "\t" +
					Session.comment + "\t" +
					Session.firstName + "\t" +
					Session.cloud_cover + "\t" +
					Session.precipitation + "\t" +
					Session.wind + "\t" +
					Session.wind_direction + "\t" +
					Session.temperature + "\t" +
					Session.humididty + "\t" +
					Session.visibility + "\t" +
					Session.obstruction + "\t" +
					Session.noise_level + "\t" + "\t" + "\t" + "\t" + "\t" + "\t" +
					Session.observationMode + "\t" +
					bearName + "\t" +
					bearZone + "\t" +
					species + "\t" +
					count + "\t" +
					size + "\t" +
					sex + "\t" +
					age + "\t" +
					marks + "\t" +
					colour + "\t" +
					new Date(timestamp).toLocaleTimeString() + "\t" +
					pawMeasure + "\t" +
					cubs + "\t" +
					ageOfCubs + "\t" +
					cubFur + "\t" +
					bearComment + "\t" +
					habituation + "\t" +
					feedingForaging + "\t" +
					nonInteractive + "\t" +
					bearBearInteractions + "\t" +
					bearHumanInteractions + "\t" +
					
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
					"Survey Observation Photos" + "\t" +
					generalComment;
				}
				data = data + "\n";
				console.log("log end");
			}
			emailAttachments.push("base64:generalSurvey.csv//" + btoa(header+"\n"+data));
			
			emailAttachments.concat(pictureAttachments);
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