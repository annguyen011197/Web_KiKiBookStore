var mongoose = require('mongoose')
var Schema = mongoose.Schema

var BookSchema = new Schema({
    name:{
        type:String
    },
    price:{
        type:Number,
        validate:{
            validator: (v) => {
                return v > 0
            },
            message:"Price > 0"
        }
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:'Author',
        required: true
    },
    publisher:{
        type:Schema.Types.ObjectId,
        ref:'Publisher'
    },
    image:
    {
        type:String,
        default:""
    },
    type: {
        type:Schema.Types.ObjectId,
        ref: 'BookType',
        required: true
    },
    description: {
        type: String
    }
})

module.exports = mongoose.model('Book',BookSchema)