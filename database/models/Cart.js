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
    status:String,
    value:{
        type:Map,
        of:Number
    },
    books:[{
        type:Schema.Types.ObjectId,
        ref:'Book'
    }]
}, {timestamps: true})

module.exports = mongoose.model('Cart',CartSchema)