angular.module('app.controllers')

.controller('tabCommentCtrl', function($scope) {

})

.controller('tabCameraCtrl', function($scope, $cordovaCamera, $cordovaFile, $cordovaSQLite) {
	$scope.camResult = "Photo page initialized";
            
	//function for taking picture using device camera
	$scope.takePhoto = function () {
		$scope.cameraResult = "taking photo";
		
		var options = {
		quality: 75,
		destinationType: Camera.DestinationType.DATA_URL,
		sourceType: Camera.PictureSourceType.CAMERA,
		allowEdit: true,
		encodingType: Camera.EncodingType.JPEG,
		targetWidth: 300,
		targetHeight: 300,
		popoverOptions: CameraPopoverOptions,
		saveToPhotoAlbum: false
		};

		$cordovaCamera.getPicture(options).then(function (imageData) {
			$scope.cameraResult ="taking photo pt.2";
			$scope.imgURI = "data:image/jpeg;base64," + imageData;
			$scope.imageInfo = imageData;
		}, function (err) {
			// An error occured
			$scope.cameraResult = "Camera error: " + err;
		});
	}
	
	//save photo to session - TODO: Session id, timestamp, GPS
	$scope.choosePhoto = function () {
		
		$scope.insertResult = "Initialized";

/*		//Delete all from logs table.
		$cordovaSQLite.execute(db, 'DELETE FROM logs')
        .then(function(result) {
            $scope.deleteResult = "deleted";
        }, function(error) {
            $scope.deleteResult = "Error on delete: " + error.message;
            return;
        })
*/

		//Put a single picture taken into logs table. TODO: Session id, timestamps, GPS
		$cordovaSQLite.execute(db, 'INSERT INTO logs (picture_data) VALUES (?)', [$scope.imageInfo])
        .then(function(result) {
            $scope.insertResult = "Picture insert successful! Probably...";
        }, function(error) {
            $scope.insertResult = "Error on saving: " + error.message;
            return;
        })

		//Test Select of pictures
		if(debug){
			$scope.selectResult = "Initialized";
			$cordovaSQLite.execute(db, "SELECT log_id, picture_data FROM logs").then(
			function(result) {
				//$scope.selectResult = "Select successful!";
				$scope.selectResult += "...Select successful! Rows length = " + result.rows.length;
				if (result.rows.length > 0) {
					$scope.fileName = "Select successful!";
					var i=0;
					while(i < result.rows.length){
						$scope.selectResult += "...log_id: "+result.rows.item(i).log_id;//+"...Picture_data: "+result.rows.item(i).picture_data;
						i++;
					}
				} else {
					$scope.selectResult += "...No rows found"
				}
			},
			function(error) {
				$scope.selectResult = "Error on loading: " + error.message;
			})
		}
	}
	
	//discard photo - TODO: fix this...
	$scope.discardPhoto = function () {
		$scope.imgURI;
		$scope.cameraResult = "Clearing photo - reloading screen";
		$state.go($state.current, {}, {reload: true});
	}

});