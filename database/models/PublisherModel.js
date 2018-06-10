var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PublisherSchema = new Schema({
    //Ten sach  
    name:{
        type:String,
        required:true,
        validate:{
            validator: (v) => {
                return v!= ''
            },
            message:"Name not empty"
        },
        index: {
            unique:true
        },
        lowercase:true
    },
    books:[{type:Schema.Types.ObjectId,ref: 'Book'}]
})

module.exports = mongoose.model('Publisher',PublisherSchema)