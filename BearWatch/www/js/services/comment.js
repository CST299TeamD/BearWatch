angular.module('app.services')

.factory('Comment', function($cordovaSQLite, Session, GPS){
    
    //count/id commments
    var count = 0;

    //object properties
    var Comment = {
        text: '',
        id: '',
        commentList: [],
        editComment: ''
    };

    //clear comment object function
    Comment.reset = function(){
        Comment.text = '';
        Comment.id = '';
        Comment.commentList = [];
    };

    //add new comment to session and save to DB
    Comment.add = function(){

        if(Comment.text != ''){
            var comment = {};
            var time = new Date();

            //check for edit
            if(Comment.editComment != ''){
                comment = Comment.editComment;
                comment.text = Comment.text;
                if(comment.id.indexOf('Updated') == -1){
                    comment.id += "-Updated";
                }
                Comment.editComment = '';
            }else{
                //create new comment
                count ++;
                comment = {
                    id: 'General-' + count,
                    timeStamp: time.toLocaleTimeString(),
                    text: Comment.text
                };
            }

            //push to comment array
            Comment.commentList.push(comment);

            //log comment in DB
            $cordovaSQLite.execute(db, 
                'INSERT INTO logs '
                + '(timestamp, session_id, comment_type, comment, utm_zone, northing, easting)'
                + ' VALUES (?, ?, ?, ?, ?, ?, ?)', 
                [time, Session.id, comment.id, comment.text, GPS.utmZone, GPS.northing, GPS.easting])
            .then(function(result) {
                //console.log(result.insertId);
            }, function(error) {
                console.log("Error Found: " + error);
            });

            //clear comment field
            Comment.text = '';
        }
    };

    //edit comment and log new comment 
    Comment.edit = function(id){

       //find comment object
        var index = -1;
        for(i = 0; i < Comment.commentList.length; i++) {
            if (Comment.commentList[i].id == id) {
                index = i;
                break;
            }
        }
        if(index > -1){
            Comment.text = Comment.commentList[index].text;
            Comment.editComment = Comment.commentList[i];
            Comment.commentList.splice(index, 1);
        }
    };

    //clear comment and log deletion
    Comment.clear = function(id){
        
        var newId = id;
        //timestamp
        var time = new Date();

        //remove from Comment object
        var index = -1;
        for(i = 0; i < Comment.commentList.length; i++) {
            if (Comment.commentList[i].id == id) {
                index = i;
                break;
            }
        }
        if(index > -1){
            Comment.commentList.splice(index, 1);
        }

        //log delete in DB
        var commentId = id.split('-Updated')[0] + '-Deleted';
        $cordovaSQLite.execute(db, 
            'INSERT INTO logs '
            + '(timestamp, session_id, comment_type, comment)'
            + ' VALUES (?, ?, ?, ?)', 
            [time, Session.id, commentId, ''])
        .then(function(result) {
            //console.log(result.insertId);
        }, function(error) {
            console.log("Error Found: " + error);
        });
    };

    return Comment;
});