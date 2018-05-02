var mongoose = require('mongoose')

var mongoDB = 'mongodb+srv://annguyen:minhan@demo-9aubp.mongodb.net/test'

let BookType = require('./models/BookTypeModel')
let Book = require('./models/BookModel')
let Author = require('./models/AuthorModel')
var async = require('async')

mongoose.connect(mongoDB).then(
    ()=>{
        console.log("Connect DB successfully");
        async.series([
            createListAuthor
        ],(err,res)=>{
            if(err) {
                console.log(err);
            }
        })
    },
    err => {
        console.log("Connection failed");
    }
)

mongoose.Promise = global.Promise

// BookType.find({'name':'Kinh dị'},(err,res)=>{
//     console.log(res);
// })

// BookType.update({'name':'Kinh dị'},{'$set':{
//     books:[...[{
//         name:'ABaC',
//         price:3000,
//     }]]
// }},(err)=>{
//     console.log(err);
// })


//Ok
// const book = new Book({
//     name:"ABC",
//     price:3000,
//     author: ""
// })

// const newType = new BookType({
//     name: "Kinh dị",
//     books: [book]
// })

// newType.save((err)=>{
//     if(err) console.log(err)
//     console.log('Saved');
// })

// book.save()


// const book = new Book({
//     name:"ABaC",
//     price:'-3000',
//     author: ""
// })

// BookType.update(
//     {name:'Kinh dị'},
//     {$push:{books: book}},
//     (err)=>{if (err) console.log(err)}
// )

// book.save()

// const newType = new BookType({
//     name: "Kinh dị dá d qwd qwdwq dư ",
//     books: []
// })

// newType.save((err)=>{
//     if(err) console.log(err)
//     console.log('Saved');
// })


function createAuthor(name, cb){
    var author = new Author({
        name: name
    })

    author.save((err)=>{
        if(err) {
            cb(err,null)
            return
        }
        cb(null,author)
    })
}

function createListAuthor(cb){
    async.parallel([
        (cb)=>{
            createAuthor('Mot',cb)
        },
        (cb)=>{
            createAuthor('Hai',cb)
        },
        (cb)=>{
            createAuthor('Ba',cb)
        },
        (cb)=>{
            createAuthor('Bon',cb)
        },
        (cb)=>{
            createAuthor('Nam',cb)
        },
        (cb)=>{
            createAuthor('Sau',cb)
        }
    ])
}