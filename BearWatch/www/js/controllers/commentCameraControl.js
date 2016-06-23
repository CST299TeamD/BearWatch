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
					Comment.edit(id);
				}
			});
		}else{
			Comment.edit(id);
		}
	};
})

.controller('tabCameraCtrl', function($scope, $ionicPopup, Picture, Session, $ionicLoading, $timeout) {

	//picture object
	$scope.Picture = Picture;
            
	//function for taking picture using device camera
	$scope.takePhoto = function () {		
		Picture.take().then(function(result){
			$scope.imgURI = result.imgURI;
		}, function (err) {
			// An error occured
			console.log("Error Found: " + err);
		});
	};
	
	//save photo to session - TODO: Session id, timestamp, GPS
	$scope.choosePhoto = function () {	
		$scope.insertResult = "Initialized";
		// Setup the loader
		$ionicLoading.show({
			template: '<h2>Updating</h2>',
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: false,
			maxWidth: 200,
			showDelay: 0
		});
		Picture.save().then(function(result){
			$scope.discardPhoto(false);
			$timeout(function () {
				$ionicLoading.hide();
			}, 300);
		}, function(err){
			console.log("Error Found: " + err);
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
					$scope.imgURI = Picture.edit(id);
				}
			});
		}else{
			$scope.imgURI = Picture.edit(id);
		}
	};
	
	//function to discard photo
	$scope.discardPhoto = function (confirm) {
		if(confirm){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Discard Photo',
				template: 'Delete photo and associated data, are you sure?</p>',
				cssClass: 'commentPopup'
			});

		   confirmPopup.then(function(res) {
				if(res) {
					$scope.imgURI = undefined;
					Picture.clear();
				}
			});
		}else{
			$scope.imgURI = undefined;
			Picture.clear();
		}
		
	};

	//function to confirm picture delete
	$scope.clearConfirm = function(id){
		var confirmPopup = $ionicPopup.confirm({
			title: 'Delete Photo',
			template: '<p>Delete photo and associated data, are you sure?</p>',
			cssClass: 'commentPopup'
		});

	   confirmPopup.then(function(res) {
			if(res) {
				Picture.clear(id);
			}
		});
	};
});