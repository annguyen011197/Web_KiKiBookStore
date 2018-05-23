var mongoose = require('mongoose')

var mongoDB = 'mongodb+srv://annguyen:minhan@kikibookstore-9aubp.mongodb.net/KikiBookStore'
//var mongoDB = 'mongodb+srv://annguyen:minhan@kikibookstore-9aubp.mongodb.net/DemonNewDB'
let BookType = require('./models/BookTypeModel')
let Book = require('./models/BookModel')
let Author = require('./models/AuthorModel')
let Account = require('./models/AccountModel')
let AccountInfo = require('./models/AccountInfoModel')
let Publisher = require('./models/PublisherModel')
let Voucher = require('./models/VoucherModel')
//let Bill = require('./mod')

var async = require('async')



mongoose.Promise = global.Promise

let authors = []
let booktypes = []
let accounts = []
let accountInfos = []
let publishers = []
let vouchers = []
let books = []

// mongoose.connect(mongoDB).then(
//     ()=>{
//         // Book.find({}).skip(1).limit(2).exec((err,books)=>{
            
//         // })
//         //.populate('publisher','name','Publisher')          .populate('author','name','Author')
//         mongoose.disconnect()
//         // Book.find({})
//         // .populate({path:'type',select:'name',model:'BookType'})
//         // .skip(1)
//         // .limit(2)
//         // .exec((err,books)=>{
//         //     callback(books)
//         // })
//     }
// )

function createData(){
    mongoose.connect(mongoDB).then(
        () => {
            console.log("Connect DB successfully");
            async.series([
                createBooktypesList,
                createAuthorList,
                createAccountInfoList,
                createAccountList,
                createPublisherList,
                createVoucherList,
                createBookList
            ], (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(res);
                }
            })
        },
        err => {
            console.log("Connection failed");
        }
    )
}


function createAuthor(name, cb) {
    var author = new Author({
        name: name
    })

    author.save((err) => {
        if (err) {
            cb(err, null)
            return
        }
        cb(null, author)
    })
    authors.push(author)
}

function createAuthorList(cb) {
    async.parallel([
        (cb) => {
            createAuthor('Triệu Kiền Kiền', cb)
        },
        (cb) => {
            createAuthor('Etsuko Ohara', cb)
        },
        (cb) => {
            createAuthor('Sato Wakiko', cb)
        },
        (cb) => {
            createAuthor('Cây Khế Có Quả', cb)
        },
        (cb) => {
            createAuthor('Lâm Ly Bi Đát', cb)
        },
        (cb) => {
            createAuthor('Điện Thoại Thông Minh', cb)
        }
    ], cb)
}

function createBooktypes(name, cb) {
    var booktype = new BookType({
        name: name
    })

    booktype.save((err) => {
        if (err) {
            cb(err, null)
            return
        }
        cb(null, booktype)
    })

    booktypes.push(booktype)
}



function createAccInfo(firstName, secondName, address, birthday, email, contactNumber, cb) {
    detailAccountInfoModel = { firstName: firstName, secondName: secondName }

    if (address != false) detailAccountInfoModel.address = address;
    if (birthday != false) detailAccountInfoModel.birthday = birthday;
    if (email != false) detailAccountInfoModel.email = email;
    if (contactNumber != false) detailAccountInfoModel.contactNumber = contactNumber;

    var accountInfoModel = new AccountInfo(detailAccountInfoModel);

    accountInfoModel.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        accountInfos.push(accountInfoModel)
        cb(null, accountInfoModel);
    });
}


function createAccountInfoList(cb) {
    async.parallel([
        function (callback) {
            createAccInfo("Lê", "Tuấn Anh", "None", false, false, false, callback)
        },
        function (callback) {
            createAccInfo("Nguyễn", "Anh", "None", false, false, false, callback)
        }
    ],
        // optional callback
        cb);
}

function createAccount(username, password, accountType, accountInfo, cb) {
    detailAccountModel = { username: username, password: password, accountType: accountType, cb }
    if (accountInfo != false) detailAccountModel.accountInfo = accountInfo

    var accountModel = new Account({
        username: username,
        password: password,
        accountType: accountType,
        accountInfo: accountInfo
    });

    accountModel.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New accountModel: ' + accountModel);
        accounts.push(accountModel)
        cb(null, accountModel)
    });
}

function createAccountList(cb) {
    async.parallel([
        function (callback) {
            createAccount('Test1', '1234', true, accountInfos[0], callback);
        },
        function (callback) {
            createAccount('Test2', '1234', false, accountInfos[1], callback);
        }
    ],
        // optional callback
        cb);
}

function createPublisher(name, cb) {
    var publisherModel = new Publisher({ name: name });
    publisherModel.save(function (err) {
        if (err) {
            console.log('ERROR CREATING publisherModel: ' + publisherModel);
            cb(err, null)
            return
        }
        console.log('New publisherModel: ' + publisherModel);
        publishers.push(publisherModel)
        cb(null, publisherModel)
    });
}

function createPublisherList(cb) {
    async.parallel([
        callback => createPublisher('NXBGD', callback),
        callback => createPublisher('NXBVH', callback),
        callback => createPublisher('NXBKD', callback),
        callback => createPublisher('NXBTinHoc', callback),
        callback => createPublisher('NXBNT', callback),
        callback => createPublisher('NXBTB', callback),
    ],
        // Optional callback
        cb);
}

function createVoucher(code, value, exp, cb) {
    var voucher = new Voucher({
        code: code,
        value: value,
        exp: exp
    })
    voucher.save(err => {
        if (err) {
            cb(err, null)
            return
        }
        vouchers.push(voucher)
        cb(null, voucher)
    })
}

function createVoucherList(cb) {
    async.parallel([
        callback => createVoucher('Test1', '0.3', new Date(), callback),
        callback => createVoucher('Test2', '0.2', new Date('1/1/2019'), callback),
        callback => createVoucher('Test3', '0.3', new Date('1/11/2019'), callback),
        callback => createVoucher('Test4', '0.4', new Date('11/1/2020'), callback),
    ],
        // Optional callback
        cb);
}

function createBook(name, price,priceSale, author, publisher, image, type, description, date, pages, deal, cb) {
    detailBookModel = {
        name: name,
        price: price,
        author: author,
        type: type,
    }
    if (publisher != false) detailBookModel.publisher = publisher
    if (description != false) detailBookModel.description = description
    if (image != false) detailBookModel.image = image
    if (deal != false) detailBookModel.deal = deal
    if (pages != false) detailBookModel.pages = pages
    if (date != false) detailBookModel.date = new Date()
    if (priceSale != false) detailBookModel.priceSale = priceSale

    var bookModel = new Book(detailBookModel);
    bookModel.save(function (err) {
        if (err) {
            console.log('ERROR CREATING bookModel: ' + bookModel);
            cb(err, null)
            return
        }
        console.log('New bookModel: ' + bookModel);
        books.push(bookModel)
        cb(null, bookModel)
    });
}

function createBookList(cb) {
    //createBook(name, price, author, publisher, image, type, description, date, pages, deal, cb)
    async.parallel([
        callback => createBook('Gửi Thanh Xuân Ấm Áp Của Chúng Ta (Tập 1 Và 2)', 3000,1500, authors[0], publishers[0], 'https://vcdn.tikicdn.com/cache/280x280/ts/product/9c/10/12/1efc0ff76e2d73a537d058f720234d18.jpg', booktypes[0], '',false,100,50, callback),
        callback => createBook('Truyện Tranh Ehon - Kerolympic', 4000, 2000, authors[1], publishers[1], 'https://vcdn.tikicdn.com/cache/200x200/ts/product/fb/2b/b3/1a4d1ae88a03f6c03d24999aa2055d35.jpg', booktypes[2], '',false,200,50, callback),
        callback => createBook('Truyện Tranh Ehon - Hạt Dưa Hấu', 7000, 3500, authors[2], publishers[2], 'https://vcdn.tikicdn.com/cache/200x200/ts/product/65/b2/ce/00ae95e7b629733054aa661caa7be486.jpg', booktypes[3], '',false,1150,50, callback),
        callback => createBook('Sách D', 100000, false, authors[0], publishers[0], false, booktypes[1], '',false,250,0.5, callback),
        callback => createBook('Sách E', 300000, false, authors[3], publishers[3], false, booktypes[3], '',false,350,0.2, callback),
        callback => createBook('Sách F', 7000, false, authors[1], publishers[5], false, booktypes[2], '',false,540,0.2, callback),
        callback => createBook('Sách G', 7000, false, authors[2], publishers[0], false, booktypes[5], '',false,510,0, callback),

    ],
        // Optional callback
        cb);
}

function createBooktypesList(cb) {
    async.parallel([
        (cb) => {
            createBooktypes('Kinh dị', cb)
        },
        (cb) => {
            createBooktypes('Hài hước', cb)
        },
        (cb) => {
            createBooktypes('Tình cảm', cb)
        },

        (cb) => {
            createBooktypes('Lãng mạng', cb)
        },
        (cb) => {
            createBooktypes('Trinh thám', cb)
        },
        (cb) => {
            createBooktypes('Đam mỹ', cb)
        },
        (cb) => {
            createBooktypes('Bách hợp', cb)
        }
    ], cb)
}

createData()