var mongoose = require('mongoose')
var Schema = mongoose.Schema

var VoucherSchema  = new Schema({
    code:{
        type:String,
        required: true,
        index:{
            unique:true
        }
    },
    value:{
        type:Number,
        required:true
    },
    Exp:{
        type:Date
    }

})

module.exports = mongoose.model('Voucher',VoucherSchema)