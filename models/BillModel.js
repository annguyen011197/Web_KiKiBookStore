var mongoose = require('mongoose')
var Schema = mongoose.Schema

var BillSchema = new Schema({
    date:{
        type:Date,
        required: true
    },
    status:{
        type:Boolean,
        required: true
    },
    voucher:{
        type:Schema.Types.ObjectId,
        ref:'Voucher'
    },
    account:{
        type:String,
        required:true
    },
    list:[{
        book:{
            type:Schema.Types.ObjectId,
            require:true
        },
        count:{
            type:Number,
            require: true,
            validate:{
                validator: (v) => {
                    return v > 0
                },
                message:"Count > 0"
            }
        }
    }],
    totalPrice:{
        type:Number,
        validate:{
            validator: (v) => {
                return v > 0
            },
            message:"Price > 0"
        }
    }
})

module.exports = mongoose.model('Bill',BillSchema)