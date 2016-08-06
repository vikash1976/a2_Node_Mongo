var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
        value: {type: String},
        createdAt: {type: Date,
        default: Date.now},
        priority: {type: Number}
        
        
   
});

module.exports = mongoose.model('Activity', schema);