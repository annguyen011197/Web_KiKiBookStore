var mongoose = require('mongoose')
var Schema = mongoose.Schema

var EventSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    detail:{
        type:String,
        required:true
    },
    image:
    {
        type:[String],
        default:""
    }
})

module.exports = mongoose.model('Event',EventSchema)