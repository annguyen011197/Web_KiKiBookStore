var mongoose = require('mongoose')
var Schema = mongoose.Schema

var AuthorSchema = new Schema({
    //Ten sach  
    name:{
        type:String
    },
    books:[{type:Schema.Types.ObjectId,ref: 'Book'}]
})

module.exports = mongoose.model('Author',AuthorSchema)