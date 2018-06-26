var mongoose = require('mongoose')
var Schema = mongoose.Schema

var AccountInfoSchema = new Schema({
    firstName:{
        type:String,
        validate:{
            validator: (v) => {
                return v!= ''
            },
            message:"first name not empty"
        }
    },
    secondName:{
        type:String,
        validate:{
            validator: (v) => {
                return v!= ''
            },
            message:"second name not empty"
        }
    },
    address:String,
    birthday:Date,
    contactNumber:String
})

module.exports = mongoose.model('AccountInfo',AccountInfoSchema)