var mongoose = require('mongoose')
var Schema = mongoose.Schema

var BillSchema = new Schema({
    Date:{
        type:Date,
        required: true
    },
    Status:{
        type:Boolean,
        required: true
    },
    Voucher:{
        type:Schema.Types.ObjectId,
        ref:'Voucher'
    },
    Customer:{
        type:String,
        required:true
    },
    List:[{
        Book:{
            type:Schema.Types.ObjectId,
            require:true
        },
        Count:{
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
    TotalPrice:{
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