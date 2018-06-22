var mongoose = require('mongoose')
var Schema = mongoose.Schema

var AuthorSchema = new Schema({
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
        lowercase:true
    },
    books:[{type:Schema.Types.ObjectId,ref: 'Book'}]
})

module.exports = mongoose.model('Author',AuthorSchema)