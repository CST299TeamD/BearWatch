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
            console.log("Comment save success" + result.insertId);
        }, function(error) {
            console.log("Error on saving comment: " + error.message);
        });

        //clear comment field
        Comment.text = '';

    };

    //edit comment and log new comment 
    Comment.edit = function(id){
       console.log("Comment edit intiated " + id);
       //find comment object
        var index = -1;
        for(i = 0; i < Comment.commentList.length; i++) {
            if (Comment.commentList[i].id == id) {
                console.log("comment found");
                index = i;
                break;
            }
        }
        if(index > -1){
            console.log(Comment.text + " = " + Comment.commentList[index].text);
            Comment.text = Comment.commentList[index].text;
            console.log(Comment.commentList[i]);
            Comment.editComment = Comment.commentList[i];
            Comment.commentList.splice(index, 1);
        }else{
            console.log('no matching comment found');
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
        console.log(commentId);
        $cordovaSQLite.execute(db, 
            'INSERT INTO logs '
            + '(timestamp, session_id, comment_type, comment)'
            + ' VALUES (?, ?, ?, ?)', 
            [time, Session.id, commentId, ''])
        .then(function(result) {
            console.log("Comment delete log success" + result.insertId);
        }, function(error) {
            console.log("Error on comment delete log: " + error.message);
        });
    };

    return Comment;
});