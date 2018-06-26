const db = require('../database/db')
const utils = require('./Utils')
const host = 'http://localhost:300'

class BookController {
    Create(value) {
        return new Promise((resolve, reject) => {
            db.CreateNewBook(value)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        });
    }

    GetBook(offset, limit) {
        return new Promise((resolve, reject) => {
            db.ReadBookListIndex(offset, limit)
                .then(res => {
                    res.forEach((e, i, a) => {
                        a[i].name = utils.UpperWord(e.name)
                        a[i].author.name = utils.UpperWord(e.author.name)
                        a[i].type.name = utils.UpperWord(e.type.name)
                        a[i].price = (e.price).toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
<<<<<<< HEAD
                        a[i].image.forEach((el,il,al)=>{
                            al[il] = utils.validURL(el) ? el : `/media/${el}`
                            console.log(al[il])
                        })
=======
>>>>>>> ltanh2
                    })
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    GetBookCount(){
        return new Promise((resolve, reject) => {
            db.ReadBookCount()
            .then(res=>resolve(res))
            .catch(err=>reject(err))
        });
    }

    GetBookDetail(id) {
        return new Promise((resolve, reject) => {
            db.ReadBookById(id)
                .then(res => {
                    res.name = utils.UpperWord(res.name)
                    res.author.name = utils.UpperWord(res.author.name)
                    res.publisher.name = utils.UpperWord(res.publisher.name)
                    res.date = new Date(res.date).toLocaleDateString()
                    res.image.forEach((e,i,a)=>{
                        a[i] = utils.validURL(e) ? e : `/media/${e}`
                    })
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    GetBookComments(id,offset,limit) {
        return new Promise((resolve, reject) => {
            db.ReadBookCommentList(id,offset,limit)
                .then(res => {
                    resolve(res[0].comments)
                })
                .catch(err => reject(err))
        })
    }
    PostComment(comment){
        return new Promise((resolve, reject) => {
            db.UpdateComments(comment)
                .then(res => {
                    resolve({"message": "Update comment complete!"})
                })
                .catch(err => reject(err))
        })
    }
<<<<<<< HEAD
=======

    SearchBookList(offset, limit, option){
        return new Promise((resolve, reject) => {
            db.SearchBookList(option)
                .then(res => {
                    let result = {}
                    result.count = res.length;
                    result.name = "Tìm kiếm từ: " + utils.UpperWord(option.name)
                    res.forEach((e,i,a) => {
                        a[i].name = utils.UpperWord(e.name)
                        a[i].author.name = utils.UpperWord(e.author.name)
                    });
                    result.books = res.slice((offset - 1) * limit, offset * limit);
                    resolve(result)
                })
                .catch(err => reject(err))
        })
    }
>>>>>>> ltanh2
}

module.exports = new BookController()