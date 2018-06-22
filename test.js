// var fs = require('fs')

// let BookType = require('./models/BookTypeModel')
// let Book = require('./models/BookModel')
// let Author = require('./models/AuthorModel')
// let Account = require('./models/AccountModel')
// let AccountInfo = require('./models/AccountInfoModel')
// let Publisher = require('./models/PublisherModel')
// let Voucher = require('./models/VoucherModel')
// var mongoose = require('mongoose')
// mongoose.Promise = global.Promise
// var mongoDB = 'mongodb+srv://annguyen:minhan@kikibookstore-9aubp.mongodb.net/KikiBookStore'
// mongoose.connect(mongoDB).then(console.log("Connected"))

// // Promise
// var isSheHappy = true;

// // var willBeCouple = new Promise(
// //     function (resolve, reject) {
// //         console.log("willBeCoulpe")
// //        if (isSheHappy) {
// //           var answer = {feedback: "I accept to be your girlfriend"};
// //           resolve(answer); // fulfilled
// //        } 
// //       else {
// //          var reason = new Error('I do not love you');
// //          reject(reason); // reject
// //       }
// //     }
// //  );

// // //  var showOff = function (answer) {
// // //     return new Promise(
// // //        function (resolve, reject) {
// // //            console.log("showOff")
// // //            console.log(answer)
// // //           var message = 'Hey friend, she accepted. This is the result: ' + answer.feedback;
// // //           resolve(message);
// // //        }
// // //     );
// // //  };

// //  var askYourGirlFriend = function () {
// //     willBeCouple
// //         .then(showOff) // chain it here
// //         .then(function (fulfilled) {
// //            console.log(fulfilled);
// //            // output: 'Hey friend, she accepted. This is the result: I accept to be your girlfriend.'
// //         })
// //         .catch(function (error) {
// //            // oops, she refused it
// //            console.log(error.message);
// //            // output: 'I do not love you'
// //         });
// //  };

// function getBook(index) {
//     return new Promise((res,rej)=>{
//         let offset=index.offset
//         let limit=index.limit
//         Book.count({})
//         .skip((offset - 1)* limit)
//         .limit(limit)
//         .exec((err, books) => {
//             if(err) throw rej(err)
//             res(books)
//         })
//     })
// }

// function doSomething() {
//     var prom = new Promise((res,rej)=>{
//         var index = {
//             limit: 0,
//             offset: 3
//         }
//         res(index)
//     }).then(getBook).then((val)=>{
//         console.log(val)
//     })
// }

// doSomething()
function do1(callback){
    let answer = 0;
    callback(answer)
}

function do2(val,callback){
    val= val+',1'
    callback(val)
}

function do3(val,callback){
    val=val+',2'
    callback(val)
}

do1(function(val){
    do2(val,function(val1){
        do3(val1,function(final){
            console.log(final)
        })
    })
})

function do1P(){

    do2P().then(val=>{
        console.log(val)
    })
}

function do2P(){
    return new Promise((resolve, reject) => {
        resolve()
    }).then(do3P)
}

function do3P(val){
    return new Promise((resolve, reject) => {
        let val = 3
        resolve(val)
    });
}
do1P();
