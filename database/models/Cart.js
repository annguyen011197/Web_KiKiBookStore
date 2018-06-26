var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CartSchema = new Schema({
    user:{
        id:{
            type:String,
            required:true
        }
    },
    date: Date,
    size:Number,
    value:{
        type:Map,
        of:Number
    } 
})

module.exports = mongoose.model('Cart',CartSchema)