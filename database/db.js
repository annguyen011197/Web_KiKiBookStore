var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var mongoDB = 'mongodb+srv://annguyen:minhan@kikibookstore-9aubp.mongodb.net/KikiBookStore'
const validate = require('../controller/Validate')

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
        mongoose.connect(mongoDB).then(console.log("Connected"))
        this.db = mongoose.connection
    }

    LoadBook(id, callback) {
        console.log(id)
        Book.findById(id)
            .populate({ path: 'type', select: 'name', model: 'BookType' })
            .populate({ path: 'author', select: 'name', model: 'Author' })
            .populate({ path: 'publisher', select: 'name', model: 'Publisher' })
            .exec((err, book) => {
                callback(book)
            })
    }

    LoadBooks(offset, limit, callback) {
        console.log('Call LoadBooks');
        Book.find({})
            .populate({ path: 'type', select: 'name', model: 'BookType' })
            .populate({ path: 'author', select: 'name', model: 'Author' })
            .skip(offset * limit)
            .limit(limit)
            .exec((err, books) => {
                books.forEach((e, i, a) => {
                    a[i].image.forEach((img, i, a) => {
                        a[i] = validate.checkURL(img) ? img : `api/media/${img}`
                    })
                })
                this.books=books
                callback(books)
            })
        // .exec((err, books) => {
        //     this.books = books
        //     console.log('Loaded Book');
        //     callback(books)
        // })

    }

    LoadBookTypes(offset, limit, callback) {
        if (this.booktypes.length > 0 && offset != 0) {
            callback(this.booktypes)
        } else {
            BookType.find({})
                .skip(offset * limit)
                .limit(limit)
                .exec((err, data) => {
                    this.booktypes = data
                    callback(data)
                })
        }
    }

    CloseDb() {
        this.db.close()
    }

    Test(offset, limit, callback) {
        var cursor = Book.find({})
            .populate({ path: 'type', select: 'name', model: 'BookType' })
            .populate({ path: 'author', select: 'name', model: 'Author' })
            .skip(offset * limit)
            .limit(limit)
            .exec((err, books) => {
                books.forEach((e, i, a) => {
                    a[i].image.forEach((img, i, a) => {
                        console.log(img)
                        console.log(validate.checkURL(img))
                        a[i] = validate.checkURL(img) ? img : `api/media/${img}`

                    })
                })

                callback(books)
            })
    }
}

module.exports = new Database()