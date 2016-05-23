angular.module('app.services')

.factory('Picture', function($cordovaCamera, $cordovaFile, $cordovaSQLite, Session, $q, BearList){
	
	//keep track of session pictures
	var count = 0;

	//picture object
	var Picture = {
		fileName: '',
		subjects: [],
		comment: '',
		imgURI: '',
		imgInfo: '',
		pictures: []
	};

	//function to check if bears are already in picture subjects
	Picture.subjectsContain = function(id, list){
		var i;
		console.log("checking for subject with id: " + id);
	    for (i = 0; i < list.length; i++) {
	        if (list[i].id == id) {
	        	console.log("Bear subject found");
	            return true;
	        }
	    }
	    return false;
	};

	//function to capture image
	Picture.take = function(){
		
		var defer = $q.defer();

		//update subject list for checkbox values
		Picture.subjects = [];		
		for(bear in BearList.add){
			console.log("bear list value: " + BearList.add[bear].name);
			var bearObj = {id: BearList.add[bear].id, name: BearList.add[bear].name, selected: false};
			Picture.subjects.push(bearObj);
		}
		
		var options = {
			quality: 100,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			//targetWidth: 300,
			//targetHeight: 300,
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false
		};

		$cordovaCamera.getPicture(options).then(function (imageData) {
			console.log("picture success");
			Picture.imgURI = "data:image/jpeg;base64," + imageData;
			Picture.imgInfo = imageData;
			count ++;
			Picture.fileName = Session.park + '-' +  Session.site + '-' + count;
			defer.resolve(Picture);
		}, function (err) {
			// An error occured
			console.log("Camera error: " + err);
			defer.reject(err);
		});

		return defer.promise;
	};

	//function to save picture and associated info
	Picture.save = function(){
		
		var defer = $q.defer();

		//find the selected subjects
		var subjects = [];
		for(subject in Picture.subjects){
			if(Picture.subjects[subject].selected){
				subjects.push(Picture.subjects[subject].name)
			}
		}

		console.log("Subjects: " + subjects.toString());

		//Save picture & data to logs table
		$cordovaSQLite.execute(db, 
			'INSERT INTO logs (timestamp, session_id, comment_type, comment, picture_subjects, picture_data)'
		+ 	' VALUES (?, ?, ?, ?, ?, ?)', 
			[new Date().toLocaleTimeString(), Session.id, 'picture-comment', Picture.comment, subjects.toString(), Picture.imgInfo])
        .then(function(result) {
            console.log("Picture insert successful!");
            Picture.pictures.push({
            	id: result.insertId, 
            	fileName: Picture.fileName, 
            	imgInfo: Picture.imgInfo, 
            	imgURI: Picture.imgURI, 
            	subjects: Picture.subjects, 
            	comment: Picture.comment, 
            	subjectString: subjects.toString()
            });
            defer.resolve(result);
        }, function(error) {
            console.log("Error on saving: " + error.message);
            defer.reject(error);
        });

        return defer.promise;
	};

	//function to clear picture results
	Picture.clear = function (id){
		console.log("picture id: " + id);
		
		//remove log from table if is was passed
		if(id !== undefined){
			
			//remove from picture object
	        var index = -1;
	        for(i = 0; i < Picture.pictures.length; i++) {
	            if (Picture.pictures[i].id == id) {
	                index = i;
	                break;
	            }
	        }
	        if(index > -1){
	            Picture.pictures.splice(index, 1);
	        }

	        //remove from DB
	        $cordovaSQLite.execute(db, 'DELETE FROM logs WHERE log_id = (?)',[id])
	        .then(function(result) {
	            console.log("Picture delete successful");
	        }, function(error) {
	            console.log("Error on picture delete: " + error.message);
	        });
		}
		Picture.fileName = '';
		Picture.subjects = [];
		Picture.comment = '';
		Picture.imgURI = '';
		Picture.imgInfo = '';
	};

	//function edit picture info
	Picture.edit = function (id){

		//find picture object
        var index = -1;
        for(i = 0; i < Picture.pictures.length; i++) {
            if (Picture.pictures[i].id == id) {
                index = i;
                break;
            }
        }
        if(index > -1){
        	//update picture
            Picture.fileName = Picture.pictures[i].fileName;
            //update subject list with any added bears		
			for(bear in BearList.add){
				if(!Picture.subjectsContain(BearList.add[bear].id, Picture.pictures[i].subjects)){
					console.log("bear list value: " + BearList.add[bear].name);
					var bearObj = {id: BearList.add[bear].id, name: BearList.add[bear].name, selected: false};
					Picture.pictures[i].subjects.push(bearObj);
				}
			}
			Picture.subjects = Picture.pictures[i].subjects;
			Picture.comment = Picture.pictures[i].comment;
			Picture.imgURI = Picture.pictures[i].imgURI;
			Picture.imgInfo = Picture.pictures[i].imgInfo;

			//remove from list
			Picture.pictures.splice(index, 1);

			//remove from DB
			//remove from DB
	        $cordovaSQLite.execute(db, 'DELETE FROM logs WHERE log_id = (?)',[id])
	        .then(function(result) {
	            console.log("Picture delete successful");
	        }, function(error) {
	            console.log("Error on picture delete: " + error.message);
	        });

			return Picture.imgURI ;
        }else{
        	return "img/pic_placeholder.png";
        }
	};

	//return picture object
	return Picture;
});