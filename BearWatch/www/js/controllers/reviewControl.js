angular.module('app.controllers')

//Controller loaded when "Review Sessions" is selected"
.controller('reviewListCtrl', function($scope, $cordovaEmailComposer, $cordovaSQLite) {
	
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