var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var mongoDB = 'mongodb+srv://annguyen:minhan@kikibookstore-9aubp.mongodb.net/KikiBookStore'
const validate = require('../controller/Validate')
var Schema = mongoose.Schema

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
    execImagePath(books) {
        books.forEach((e, i, a) => {
            a[i].image.forEach((img, i, a) => {
                a[i] = validate.checkURL(img) ? img : `api/media/${img}`
            })
        })
        return books
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
            .skip((offset - 1)* limit)
            .limit(limit)
            .exec((err, books) => {
                if(err) throw err
                books = this.execImagePath(books)
                this.books = books
                callback(books)
            })
    }

    LoadBookTypes(offset, limit, callback) {
        // if (this.booktypes.length > 0 && offset != 0) {
        //     callback(this.booktypes)
        // } else {
            BookType.find({})
                .skip((offset - 1) * limit)
                .limit(limit)
                .exec((err, data) => {
                    this.booktypes = data
                    callback(data)
                })
        //}
    }

    LoadAllTypes(callback){
        // BookType.find({})
        // .skip(offset * limit)
        // .limit(limit)
        // .exec((err, data) => {
        //     this.booktypes = data
        //     callback(data)
        // })
        let cursor = BookType.find({}).cursor()
        callback(cursor)
    }

    LoadBooksCategory(offset, limit, type, callback) {
        try{
            Book.find({ 'type': type })
            .populate({ path: 'type', select: 'name', model: 'BookType' })
            .populate({ path: 'author', select: 'name', model: 'Author' })
            .skip((offset - 1) * limit)
            .limit(limit)
            .exec((err, books) => {
                if(err) throw (err)
                books = this.execImagePath(books)
                let name 
                if(books.length>0){
                   name = books[0].type.name
                }
                callback(books,name)
            })
        }catch(err){
            console.log(err)
            callback([],'')
        }
    }

    LoadCountByCategory(type, callback){
        Book.find({ 'type': type }).populate({ path: 'type', select: 'name', model: 'BookType' }).count(function(err, result) {
            callback(result);
       });
       //return Book.find({ 'type': type }).populate({ path: 'type', select: 'name', model: 'BookType' }).count();
    }

    CheckAccount(username,password, callback){
        try{
            Account.find({ 'username': username })
            .exec((err, accounts) => {
                if(accounts == null || accounts.length == 0) {
                    callback({login: false, msg: "-1"});
                    return;
                }
                if(accounts[0].password == password){
                    callback({login: true});
                }else{
                    callback({login: false,msg: "0"});
                }
            })
        }catch(err){
            console.log(err)
            callback([],'')
        }
    }

    createAccount(username, password, accountType, accountInfo, callback) {
        let detailAccountModel = { username: username, password: password, accountType: accountType}
        if (accountInfo != false) detailAccountModel.accountInfo = accountInfo
        if(username == null || username == ""){
            callback({err:"Username is empty"},null);
        }
        if(password == null || password == ""){
            callback({err:"Password is empty"},null);
        }
        var accountModel = new Account(detailAccountModel);
        try{
            accountModel.save(function (err) {
                if (err) {
                    callback(err, null)
                    return
                }
                console.log('New accountModel: ' + accountModel);
                callback(null, accountModel)
            });
        }catch(err){
            callback(err, null)
            return;
        }
       
    }

    LoadCountBook(){
        return new Promise((resolve, reject) => {
            Book.count().exec((err,res)=>{
                resolve(res)
            })
        });
    }

    CloseDb() {
        this.db.close()
    }

    Test(offset, limit, type, callback) {
        console.log(type)
        Book.find({ 'type': type })
            .populate({ path: 'type', select: 'name', model: 'BookType' })
            .populate({ path: 'author', select: 'name', model: 'Author' })
            .skip((offset - 1) * limit)
            .limit(limit)
            .exec((err, books) => {
                callback(books)
            })
        //BookType.find({'_id':type}).exec((err,res)=>callback(res))
        // Book.find({'type':type}).exec((err,res)=>callback(res))
    }
}

module.exports = new Database()