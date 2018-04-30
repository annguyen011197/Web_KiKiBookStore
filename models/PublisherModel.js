var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PublisherSchema  = new Schema({
    name:{
        type:String,
        required: true
    }
})

module.exports = mongoose.model('Publisher',PublisherSchema)