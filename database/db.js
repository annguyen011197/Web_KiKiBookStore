var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var mongoDB = 'mongodb+srv://annguyen:minhan@demo-9aubp.mongodb.net/KikiBook'

let BookType = require('../models/BookTypeModel')
let Book = require('../models/BookModel')
let Author = require('../models/AuthorModel')
let Account = require('../models/AccountModel')
let AccountInfo = require('../models/AccountInfoModel')
let Publisher = require('../models/PublisherModel')
let Voucher = require('../models/VoucherModel')

class Database {
    constructor() {
        this.authors = []
        this.booktypes = []
        this.accounts = []
        this.accountInfos = []
        this.publishers = []
        this.vouchers = []
        this.books = []
        mongoose.connect(mongoDB).then(console.log('Connected'))
        this.db = mongoose.connection
    }

    LoadBooks(callback) {
        this.db.on('open',()=>{
            Book.find({})
            .populate({path:'type',select:'name',model:'BookType'})
            .skip(1)
            .limit(2)
            .exec((err,books)=>{
                this.books = books
                console.log('Loaded Book');
                callback(books)
            })
        })
    }

    CloseDb(){
        this.db.close()
    }
}

module.exports = new Database()