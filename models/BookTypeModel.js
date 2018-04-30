var mongoose = require('mongoose')
var Schema = mongoose.Schema

var BookTypeSchema = new Schema({
    name:{
        type:String,
        unique:true,
        validate:{
            validator: (v)=>{
                return v.lenght < 20
            },
            message: 'Failed'
        }
    }
})

module.exports = mongoose.model('BookType',BookTypeSchema)