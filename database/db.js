var mongoose = require("mongoose")
const path = require("path")
var mongoDB = require("../gPath.js").connectString
const utils = require('../controller/Utils')
const sharp = require('sharp')

const imageStore = path.join(__dirname, './images')

const Book = require("./models/BookModel")
const Category = require("./models/BookTypeModel")
const Author = require("./models/AuthorModel")
const Publisher = require("./models/PublisherModel")
const Account = require('./models/AccountModel')
const AccountInfoModel = require('./models/AccountInfoModel')
const Cart = require('./models/Cart')
const Event = require('./models/Event')
const normalize = require('normalize-strings');
class Database {
    constructor() {
        mongoose.connect(mongoDB).then(console.log("Connected"))
    }

    CreateAuthor(val) {
        console.log("Tao Author moi")
        var author = new Author({
            name: val.name ? val.name : ""
        })
        return new Promise((resolve, reject) => {
            author.save((err, res) => {
                if (err) reject(err)
                resolve(res)
                console.log(`Tao thanh cong Author` + val.name)
            })
        })
    }

    async CreateEvent(val) {
        console.log("Tao Event moi")
        await this.SaveImage(val.image).then(res => {
            val.image = res
        }).catch(err => val.image = '')
        var event = new Event({
            name: val.name ? val.name : "",
            detail: val.detail ? val.detail : "",
            image: val.image ? val.image : ""
        })
        return new Promise((resolve, reject) => {
            event.save((err, res) => {
                if (err) reject(err)
                resolve(res)
                console.log(`Tao thanh cong event` + val.name)
            })
        })
    }

    CreatePublisher(val) {
        console.log("Tao Publisher moi")
        var publisher = new Publisher({
            name: val.name ? val.name : ""
        })
        return new Promise((resolve, reject) => {
            publisher.save((err, res) => {
                if (err) reject(err)
                resolve(res)
                console.log(`Tao thanh cong Publisher` + val.name)
            })
        })
    }

    CreateCategory(val) {
        console.log("Tao Category moi")
        var category = new Category({
            name: val.name ? val.name : ""
        })
        return new Promise((resolve, reject) => {
            category.save((err, res) => {
                if (err) reject(err)
                resolve(res)
                console.log(`Tao thanh cong Category` + val.name)
            })
        })
    }

    CreateAccountInfo(val) {
        console.log("Tao Account Info moi")
        var accountInfoModel = new AccountInfoModel({
            firstName: val.firstName ? val.firstName : "",
            secondName: val.secondName ? val.secondName : "",
            address: val.address ? val.address : null,
            birthday: val.birthday ? val.birthday : null,
            contactNumber: val.contactNumber ? val.contactNumber : null
        })
        console.log(accountInfoModel);
        return new Promise((resolve, reject) => {
            accountInfoModel.save((err, res) => {
                if (err) reject(err)
                resolve(res)
                console.log(`Tao thanh cong AccountInfoModel ${res._id}`)
            })
        })
    }

    CreateBook(val) {
        console.log("Tao book moi")
        let book = new Book({
            name: val.name,
            price: val.price,
            date: val.date,
            pages: val.pages,
            image: val.image,
            description: val.description,
            size: val.size,
            typebook: val.typebook,
            language: val.language,
            type: val.category,
            publisher: val.publisher,
            author: val.author
        })
        return new Promise((resolve, reject) => {
            book.save((err, res) => {
                if (err) reject(err)
                resolve(res)
                //console.log(`Tao thanh cong Book ${res.name}`)
            })
        })
    }

    async CreateNewBook(val) {
        let publisher, author, category
        if (val.publisher)
            await this.CheckPublisherAndCreate({ name: val.publisher }).then(res => {
                val.publisher = { name: res.name, id: res._id }
                publisher = res
            })
        if (val.author)
            await this.CheckAuthorAndCreate({ name: val.author }).then(res => {
                val.author = { name: res.name, id: res._id }
                author = res
            })
        await this.CheckCategoryAndCreate({ name: val.category }).then(res => {
            val.category = { name: res.name, id: res._id }
            category = res
        })

        await this.SaveImage(val.image).then(res => {
            val.image = res
        }).catch(err => val.image = '')
        return new Promise((resolve, reject) => {
            this.CreateBook(val)
                .then(res => {
                    if(publisher){
                        publisher.books.push(res)
                        publisher.save()
                    }
                    if(author){
                        author.books.push(res)
                        category.save()
                    }
                    if(category){
                        category.books.push(res)   
                        author.save()
                    }
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    DeleteCartItem(val){
        let bookID
        return new Promise((resolve, reject) => {
            Cart.findOne({ 'user.id': val.id, status: 'new' })
                .exec((err, res) => {
                    if (err) reject(err)
                    bookID = new mongoose.Types.ObjectId(val.product)
                    if (res) {
                        console.log(res)
                        res.date = new Date()
                        let size = res.value.get(val.product)
                        res.value.delete(val.product)
                        console.log(size)
                        res.size = res.size - size
                        res.books.pull(bookID)
                        res.delete
                        res.save()
                        resolve(res.size)
                    } 
                })
        })
    }

    SetCart(val) {
        let bookID
        return new Promise((resolve, reject) => {
            Cart.findOne({ 'user.id': val.id, status: 'new' })
                .exec((err, res) => {
                    if (err) reject(err)
                    //console.log(bookID)
                    bookID = new mongoose.Types.ObjectId(val.product)
                    if (res) {
                        res.date = new Date()
                        let size = res.value.get(val.product)
                        res.value.set(val.product, size ? size + val.size : val.size)
                        res.size = res.size + val.size
                        res.books.addToSet(bookID)
                        res.save()
                        resolve(res.size)
                    } else {
                        let cart = new Cart({
                            date: new Date(),
                            'user.id': val.id,
                            value: {},
                            size: 0,
                            status: 'new'
                        })
                        cart.value.set(val.product, val.size)
                        cart.size = cart.size + val.size
                        cart.books.addToSet(bookID)
                        cart.save()
                        resolve(cart.size)
                    }
                })
        })
    }

    GetSizeCart(val) {
        return new Promise((resolve, reject) => {
            Cart.findOne({ 'user.id': val.id, status: 'new' })
                .exec((err, res) => {
                    if (err) reject(err)
                    if (res) {
                        console.log(val)
                        if(val.newId ){
                            res.user.id = val.newId
                            console.log(res)
                            res.save()
                        }
                        resolve(res.size.toString())
                    }
                    reject(null)
                })
        });
    }

    SaveCart(val){
        return new Promise((resolve, reject) => {
            Cart.findOne({ 'user.id': val.id, status: 'new' })
                .exec((err, res) => {
                    if (err) reject(err)
                    if (res) {
                        res.date = new Date()
                        res.total = 0
                        res.value.clear()
                        res.books = []
                        for(let key in val.list){
                            res.value.set(key,parseInt(val.list[key]))
                            res.total += parseInt(val.list[key])
                            res.books.addToSet(new mongoose.Types.ObjectId(key))
                        }
                        res.status = 'accept'
                        res.save()
                        resolve(res)
                    } 
                })
        })
    }

    GetCartInfo(val) {
        return new Promise((resolve, reject) => {
            Cart.findOne({ 'user.id': val, status: 'new' })
                .populate({
                    path: 'books',
                    select: 'name price image author',
                    model: 'Book'
                })
                .lean()
                .exec((err, res) => {
                    if (err) reject(err)
                    resolve(res)
                })
        })
    }

    SaveImage(base64) {
        return new Promise((resolve, reject) => {
            let name = utils.hashName('webp')
            let res = utils.decodeBase64Image(base64)
            sharp(res.data)
                .toFile(path.join(imageStore, name), (err, info) => {
                    if (err) reject(err)
                    resolve(name)
                })
        })

    }

    ReadBookById(id) {
        return new Promise((resolve, reject) => {
            Book.findById(id)
                .lean()
                .exec((err, res) => {
                    //console.log(res)
                    if (err) reject(err)
                    resolve(res)
                })
        })
    }

    ReadBookList(offset, limit) {
        return new Promise((resolve, reject) => {
            Book.find({})
                .skip((offset - 1) * limit)
                .limit(limit)
                .lean()
                .exec((err, res) => {
                    if (err) reject(err)
                    resolve(res)
                })
        });
    }

    SearchBookList(option) {
        let search = {}
        if (option.moneyMin && option.moneyMax) {
            search.price = { $gte: option.moneyMin, $lte: option.moneyMax }
        }
        if (option.author) {
            search["author.id"] = option.author;
        }
        if (option.type) {
            search["type.id"] = option.type;
        }
        const wordSearch = option.name ? normalize(option.name) : "";
        return new Promise((resolve, reject) => {
            Book.find(search)
                .lean()
                .sort(option.sort)
                .exec((err, res) => {
                    if (err) reject(err)
                    if (wordSearch != "") {
                        let result = [];
                        if (res)
                            res.forEach(element => {
                                const nameNoUnicode = normalize(element.name).toLowerCase();
                                if (nameNoUnicode.indexOf(wordSearch.toLowerCase()) >= 0 || wordSearch == "") {
                                    result.push(element);
                                }
                            });
                        resolve(result)
                    } else {
                        resolve(res)
                    }

                })
        });
    }

    ReadBookCommentList(id, offset, limit) {
        return new Promise((resolve, reject) => {
            Book.find({ _id: id }, { comments: { $slice: [(offset - 1) * limit, limit] } })
                .lean()
                .exec((err, res) => {
                    if (err) reject(err)
                    resolve(res)
                })
        })
    }

    ReadBookListIndex(offset, limit) {
        return new Promise((resolve, reject) => {
            Book.find({})
                .skip((offset - 1) * limit)
                .limit(limit)
                .select('name author price image type')
                .lean()
                .exec((err, res) => {
                    if (err) reject(err)
                    resolve(res)
                })
        });
    }

    ReadBookListRelated(id) {
        return new Promise((resolve, reject) => {
            Category.findById(id)
                .populate({
                    path: 'books',
                    select: 'name author price image',
                    model: 'Book'
                })
                .lean()
                .exec((err, res) => {
                    if (err) reject(err)
                    resolve(res.books)
                })
        })
    }

    ReadEventList(offset, limit) {
        return new Promise((resolve, reject) => {
            Event.find({})
                .skip((offset - 1) * limit)
                .limit(limit)
                .lean()
                .exec((err, res) => {
                    if (err) reject(err)
                    resolve(res)
                })
        });
    }

    ReadBookCount() {
        return new Promise((resolve, reject) => {
            Book.count({}).exec((err, count) => {
                if (err) reject(err)
                resolve(count)
            })
        })

    }

    ReadAuthorList(offset, limit) {
        return new Promise((resolve, reject) => {
            Author.find({})
                .skip((offset - 1) * limit)
                .limit(limit)
                .exec((err, res) => {
                    if (err) reject(err)
                    resolve(res)
                })
        });
    }

    ReadPublisherList(offset, limit) {
        return new Promise((resolve, reject) => {
            Publisher.find({})
                .skip((offset - 1) * limit)
                .limit(limit)
                .exec((err, res) => {
                    if (err) reject(err)
                    resolve(res)
                })
        });
    }

    ReadCategoryList(offset, limit) {
        return new Promise((resolve, reject) => {
            Category.find({})
                .skip((offset - 1) * limit)
                .limit(limit)
                .exec((err, res) => {
                    if (err) reject(err)
                    resolve(res)
                })
        });
    }

    ReadCategoryListName(offset, limit) {
        return new Promise((resolve, reject) => {
            Category.find({})
                .skip((offset - 1) * limit)
                .limit(limit)
                .select('name')
                .exec((err, res) => {
                    if (err) reject(err)
                    resolve(res)
                })
        });
    }

    ReadBookListType(id) {
        return new Promise((resolve, reject) => {
            Category.findById(id)
                .populate({
                    path: 'books',
                    select: 'name author price image',
                    model: 'Book'
                })
                .lean()
                .exec((err, res) => {
                    if (err) reject(err)
                    resolve(res)
                })
        })
    }

    ReadAccount(id) {
        return new Promise((resolve, reject) => {
            Account.findById(id)
                .populate({
                    path: 'local.accountInfo',
                    select: 'firstName secondName address birthday contactNumber verify',
                    model: 'AccountInfo'
                })
                .lean()
                .exec((err, res) => {
                    console.log(res)
                    if (err) reject(err)
                    resolve(res)
                })
        });
    }

    ReadAccountExt(value) {
        return new Promise((resolve, reject) => {
            Account.find(value)
                .populate({
                    path: 'local.accountInfo',
                    select: 'firstName secondName address birthday contactNumber',
                    model: 'AccountInfo'
                })
                .lean()
                .exec((err, res) => {
                    console.log(res)
                    if (err) reject(err)
                    resolve(res)
                })
        });
    }

    ReadAccountInfo(id) {
        return new Promise((resolve, reject) => {
            AccountInfoModel.findById(id)
                .lean()
                .exec((err, res) => {
                    console.log(res)
                    if (err) reject(err)
                    resolve(res)
                })
        });
    }

    UpdateAccountInfo(val) {
        return new Promise((resolve, reject) => {
            AccountInfoModel.update(val.find, val.update)
                .exec((err, res) => {
                    console.log(res)
                    if (err) reject(err)
                    resolve(res)
                })
        });
    }

    UpdateAccount(val) {
        return new Promise((resolve, reject) => {
            Account.update(val.find, val.update)
                .exec((err, res) => {
                    console.log(res)
                    if (err) reject(err)
                    resolve(res)
                })
        });
    }

    UpdateAuthorName(preVal, newVal) {
        return new Promise((resolve, reject) => {
            this.CheckAuthor({ name: newVal.name }).then(res => {
                if (res.length > 0) reject("Ten da ton tai")
                else {
                    Author.findOneAndUpdate(
                        { name: preVal.name },
                        { name: newVal.name }
                    ).exec((err, res) => {
                        if (err) reject(err)
                        Book.updateMany(
                            {
                                "author.id": res._id
                            },
                            {
                                "author.name": newVal.name
                            }
                        ).exec((err, res) => {
                            if (err) reject(err)
                            resolve(res)
                        })
                    })
                }
            })
        })
    }

    UpdatePublisherName(preval, newval) {
        return new Promise((resolve, reject) => {
            this.CheckPublisher({ name: newVal.name }).then(res => {
                if (res.length > 0) reject("Ten da ton tai")
                else {
                    Publisher.findOneAndUpdate(
                        { name: preval.name },
                        { name: newval.name }
                    ).exec((err, res) => {
                        if (err) reject(err)
                        Publisher.updateMany(
                            {
                                "publisher.id": res._id
                            },
                            {
                                "publisher.name": newval.name
                            }
                        )
                    })
                }
            })
        })
    }
    //Comment.id = id sách, Comment.data = data sách
    UpdateComments(comment) {
        return new Promise((resolve, reject) => {
            Book.update(
                { _id: comment.id },
                {
                    $push: {
                        comments: comment.data
                    }
                }
            ).exec((err, res) => {
                if (err) reject(err)
                resolve({ "message": "Update comment complete!" })
            })
        })
    }

    UpdateInfoAccount(val) {
        return new Promise((resolve, reject) => {
            Account.update(
                { _id: comment.id },
                {
                    $push: {
                        comments: comment.data
                    }
                }
            ).exec((err, res) => {
                if (err) reject(err)
                resolve({ "message": "Update comment complete!" })
            })
        })
    }

    UpdatecCategoryName(preval, newval) {
        return new Promise((resolve, reject) => {
            this.CheckCategory({ name: newVal.name }).then(res => {
                if (res.length > 0) reject("Ten da ton tai")
                else {
                    Category.findOneAndUpdate(
                        { name: preVal.name },
                        { name: newVal.name }
                    ).exec((err, res) => {
                        if (err) reject(err)
                        Book.updateMany(
                            {
                                "type.id": res._id
                            },
                            {
                                "type.name": newVal.name
                            }
                        ).exec((err, res) => {
                            if (err) reject(err)
                            resolve(res)
                        })
                    })
                }
            })
        })
    }

    DeleteBookByID(val) {
        return new Promise((resolve, reject) => {
            Book.deleteOne({ _id: val.id }).exec((err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        });
    }

    DeleteBookByName(val) {
        return new Promise((resolve, reject) => {
            Book.deleteMany({ name: val.name }).exec((err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }

    async DeleteAuthorByName(val) {
        let id
        await this.CheckAuthor({ name: val.name }).then(res => {
            id = res[0]._id
        })
        await Book.deleteMany({ "author.id": id })
        Author.deleteOne({ name: val.name }).exec((err, res) => {
            if (err) console.log(err)
            console.log(res)
        })
    }

    async DeletePublisherByName(val) {
        let id
        await this.CheckPublisher({ name: val.name }).then(res => {
            id = res[0]._id
        })
        await Book.deleteMany({ "publisher.id": id })
        Publisher.deleteOne({ name: val.name }).exec((err, res) => {
            if (err) console.log(err)
            console.log(res)
        })
    }

    async DeleteCategoryByName(val) {
        let id
        await this.CheckCategory({ name: val.name }).then(res => {
            id = res[0]._id
        })
        await Book.deleteMany({ "publisher.id": id })
        Publisher.deleteOne({ name: val.name }).exec((err, res) => {
            if (err) console.log(err)
            console.log(res)
        })
    }

    CheckAuthor(val) {
        return new Promise((resolve, reject) => {
            Author.find({ name: val.name }).exec((err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }

    CheckPublisher(val) {
        return new Promise((resolve, reject) => {
            Publisher.find({ name: val.name }).exec((err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }

    CheckCategory(val) {
        return new Promise((resolve, reject) => {
            Category.find({ name: val.name }).exec((err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }

    CheckAuthorAndCreate(val) {
        return new Promise((resolve, reject) => {
            this.CheckAuthor(val)
                .then(res => {
                    if (res.length > 0) {
                        console.log("Author da ton tai")
                        resolve(res[0])
                    } else {
                        this.CreateAuthor(val).then(res => {
                            resolve(res)
                        })
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    CheckCategoryAndCreate(val) {
        return new Promise((resolve, reject) => {
            this.CheckCategory(val)
                .then(res => {
                    if (res.length > 0) {
                        console.log("Category da ton tai")
                        resolve(res[0])
                    } else {
                        this.CreateCategory(val).then(res => {
                            resolve(res)
                        })
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    CheckPublisherAndCreate(val) {
        return new Promise((resolve, reject) => {
            this.CheckPublisher(val)
                .then(res => {
                    if (res.length > 0) {
                        console.log("Publisher da ton tai")
                        resolve(res[0])
                    } else {
                        this.CreatePublisher(val).then(res => {
                            resolve(res)
                        })
                    }
                })
                .catch(err => reject(err))
        })
    }
}

module.exports = new Database()
