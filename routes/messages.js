var express = require('express');
var router = express.Router();
var Message = require('../models/message');

router.get('/', function(req, res, next) {
    Message.find()
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

router.post('/', function(req, res, next) {
    var message = new Message({
        content: req.body.content
    });
    message.save(function (err, result) {
        if(err) {
           return res.status(404).json({
                title: "An error occured",
                error: err
            });
        }
        res.status(201).json({
            title: "Saved message",
            obj: result 
        });
    });
});
router.patch('/:id', function(req, res, next) {
    Message.findById(req.params.id, function(err, doc){
        if(err) {
           return res.status(404).json({
                title: "An error occured",
                error: err
            });
        }
        if( !doc) {
           return res.status(404).json({
            title: "Message Not Found",
            error: {message: "Message could not be found"} 
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
    Message.findById(req.params.id, function(err, doc){
        if(err) {
           return res.status(404).json({
                title: "An error occured",
                error: err
            });
        }
        if( !doc) {
           return res.status(404).json({
            title: "Message Not Found",
            error: {message: "Message could not be found"} 
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