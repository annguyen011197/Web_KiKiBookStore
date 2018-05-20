var mongoose = require('mongoose')
var Schema = mongoose.Schema

var BookTypeSchema = new Schema({
    name:{
        type:String,
        unique:true,
        validate:{
            validator: (v)=>{
                return v.length < 20
            },
            message: 'Failed'
        },
        required:true
    }
})

module.exports = mongoose.model('BookType',BookTypeSchema)