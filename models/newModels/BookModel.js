var mongoose = require('mongoose')
var Schema = mongoose.Schema

var BookSchema = new Schema({
    //Ten sach  
    name:{
        type:String,
        required: true
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
    date:{
        type: String
    },
    pages:{
        type:Number
    },
    image:
    {
        type:[String],
        default:""
    },
    description: {
        type: String
    },
    size:{
        width:Number,
        height:Number,
        weight:Number
    },
    typebook:String,
    language:String,
    type: {
        name:{
            type:String,
            require:true
        },
        id:{
            type:String,
            require:true
        }
    },
    publisher:{
        name:{
            type:String,
            require:true
        },
        id:{
            type:String,
            require:true
        }
    },
    author:{
        name:{
            type:String,
            require:true
        },
        id:{
            type:String,
            require:true
        }
    },
})

module.exports = mongoose.model('Book',BookSchema)