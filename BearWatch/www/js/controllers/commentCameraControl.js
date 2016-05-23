angular.module('app.controllers')

.controller('tabCommentCtrl', function($scope, Comment, $ionicPopup) {
	$scope.Comment = Comment;

	//function to verify user comment edit (may overwrite unsaved text field)
	$scope.editRequest = function (id){
		if(Comment.text != '' && Comment.text != null){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Edit Comment',
				template: '<h1>Warning</h1> <p>Text detected in comment field. Editing this comment will overwrite unsaved text, are you sure?</p>',
				cssClass: 'commentPopup'

			});

		   confirmPopup.then(function(res) {
				if(res) {
					console.log('Comment edit confirmed');
					Comment.edit(id);
				} else {
					console.log('Comment edit aborted');
				}
			});
		}else{
			console.log('Here we go - Comment edit ' + id);
			Comment.edit(id);
		}
	};
})

.controller('tabCameraCtrl', function($scope, $ionicPopup, Picture) {
	$scope.debug = debug;

	//picture object
	$scope.Picture = Picture;
            
	//function for taking picture using device camera
	$scope.takePhoto = function () {
		
		Picture.take().then(function(result){
			console.log("Photo taken");
			$scope.imgURI = result.imgURI;
		}, function (err) {
			// An error occured
			console.log("Camera error: " + err);
		});
	};
	
	//save photo to session - TODO: Session id, timestamp, GPS
	$scope.choosePhoto = function () {
		
		$scope.insertResult = "Initialized";

		Picture.save().then(function(result){
			$scope.discardPhoto();
		}, function(err){
			console.log("Photo save error: " + err);
		});
	};

	//function to edit photo
	$scope.editPicture = function(id){
		if($scope.imgURI !== undefined){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Edit Photo',
				template: '<h1>Warning</h1> <p>Unsaved photo detected. Editing this this will overwrite unsaved text, are you sure?</p>',
				cssClass: 'commentPopup'

			});

		   confirmPopup.then(function(res) {
				if(res) {
					console.log('Photo edit confirmed');
					$scope.imgURI = Picture.edit(id);
				} else {
					console.log('Photo edit aborted');
				}
			});
		}else{
			console.log('Here we go - Photo edit ' + id);
			$scope.imgURI = Picture.edit(id);
		}
	};
	
	//function to discard photo
	$scope.discardPhoto = function () {
		$scope.imgURI = undefined;
		Picture.clear();
	};

});