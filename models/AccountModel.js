var mongoose = require('mongoose')
var Schema = mongoose.Schema

var AccountSchema = new Schema({
    username: {
        type: String,
        validate: {
            validator: (v) => {
                return v != ''
            },
            message: "first name not empty"
        },
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: Boolean,
        default: false
    },
    accountInfo: {
        type: Schema.Types.ObjectId,
        ref: 'AccountInfo'
    }
})

module.exports = mongoose.model('Account', AccountSchema)