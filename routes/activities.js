var express = require('express');
var router = express.Router();
var Activity = require('../models/activity');

router.get('/', function(req, res, next) {
    Activity.find()
    .exec(function(err, result){
            if(err) {
               return res.status(404).json({
                    title: "An error occured",
                    error: err
                });
            }
            res.status(200).json({
                title: "Success",
                obj: result 
            });
     })
 });
 
 router.get('/:priority', function(req, res, next) {
     var headers = {'Content-Type': 'text/javascript', 
			'Access-Control-Allow-Headers': 'X-Custom-Header, Origin, X-Requested-With, Content-Type, Accept',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
			'Access-Control-Allow-Origin': '*'};
    Activity.find({priority: req.params.priority})
    .exec(function(err, result){
            if(err) {
               return res.status(404).json({
                    title: "An error occured",
                    error: err
                });
            }
           
            res.set({'Content-Type': 'text/javascript', 
			'Access-Control-Allow-Headers': 'X-Custom-Header, Origin, X-Requested-With, Content-Type, Accept',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
			'Access-Control-Allow-Origin': '*'}).status(200).json({
                title: "Success",
                obj: result 
            });
     });
 });

router.post('/', function(req, res, next) {
    var activity = new Activity({
        value: req.body.value,
        createdAt: req.body.createdAt,
        priority: req.body.priority
    });
    console.log("Activity to save: ", JSON.stringify(req.body, null, 4));
    activity.save(function (err, result) {
        if(err) {
           return res.status(404).json({
                title: "An error occured",
                error: err
            });
        }
        res.status(201).json({
            title: "Saved activity",
            obj: result 
        });
    });
});
router.patch('/:id', function(req, res, next) {
    Activity.findById(req.params.id, function(err, doc){
        if(err) {
           return res.status(404).json({
                title: "An error occured",
                error: err
            });
        }
        if( !doc) {
           return res.status(404).json({
            title: "Activity Not Found",
            error: {message: "Activity could not be found"} 
            })
        }
        doc.content = req.body.content;
        doc.save(function (err, result) {
           if(err) {
            return res.status(404).json({
                    title: "An error occured",
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: result
            });
        });

    });
});
router.delete('/:id', function(req, res, next) {
    Activity.findById(req.params.id, function(err, doc){
        if(err) {
           return res.status(404).json({
                title: "An error occured",
                error: err
            });
        }
        if( !doc) {
           return res.status(404).json({
            title: "Activity Not Found",
            error: {message: "Activity could not be found"} 
            })
        }
        
        doc.remove(function (err, result) {
           if(err) {
            return res.status(404).json({
                    title: "An error occured",
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: result
            });
        });

    });
});
module.exports = router;