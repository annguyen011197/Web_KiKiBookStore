var mongoose = require('mongoose')
var Schema = mongoose.Schema

var BookSchema = new Schema({
    //Ten sach  
    name:{
        type:String
    },
    //Gia goc
    price:{
        type:Number,
        validate:{
            validator: (v) => {
                return v > 0
            },
            message:"Price > 0"
        }
    },
    //Gia sale
    priceSale:{
        type:Number,
        validate:{
            validator: (v) => {
                return v > 0
            },
            message:"Price > 0"
        }
    },
    deal:{
        type:Number
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:'Author',
        required: true
    },
    //Nha xuat ban
    publisher:{
        type:Schema.Types.ObjectId,
        ref:'Publisher'
    },
    //Ngay xuat ban,
    date:{
        type: Date
    },
    pages:{
        type:Number
    },
    //Duong dan hinh anh
    image:
    {
        type:[String],
        default:""
    },
    //Loai sach 
    type: {
        type:Schema.Types.ObjectId,
        ref: 'BookType',
        required: true
    },
    //Gioi thieu sach
    description: {
        type: String
    }
})

module.exports = mongoose.model('Book',BookSchema)