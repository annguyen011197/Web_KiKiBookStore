var mongoose = require('mongoose')
var Schema = mongoose.Schema

var AccountInfoSchema = new Schema({
    firstName:String,
    secondName:String,
    address:String,
    birthday:Date,
    email:String,
    contactNumber:String
})

module.exports = mongoose.model('AccountInfo',AccountInfoSchema)