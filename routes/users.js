var express = require('express');
var router = express.Router();
var User = require('../models/user');
var PasswordHash = require('password-hash');
var jwt = require('jsonwebtoken');
var encKey = 'secret';
router.post('/', function(req, res, next) {
    var user = new User({
        email: req.body.email,
        password: PasswordHash.generate(req.body.password),
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });
    
    user.save(function (err, result) {
        if(err) {
           return res.status(404).json({
                title: "An error occured",
                error: {message: "EmailId already in taken"}
            });
        }
        res.status(201).json({
            title: "Saved user",
            obj: result 
        });
    })
});
router.post('/signin', function(req, res, next){
    User.findOne({email: req.body.email}, function(err, doc){
        if(err) {
           return res.status(404).json({
                title: "An error occured",
                error: err
            });
        }
        if(!doc) {
            return res.status(404).json({
                title: "No user found",
                error: {message: 'User could not be found'}
            });
        }
        if(! PasswordHash.verify(req.body.password, doc.password)){
            return res.status(404).json({
                title: "Could not sign you in",
                error: {message: 'Invalid credentials'}
            });
        }
        var token = jwt.sign({user: doc}, encKey, {expiresIn: 7200});
        res.status(200).json({
            message: 'Success',
            token: token,
            userId: doc._id
        });
    });
})
module.exports = router;
