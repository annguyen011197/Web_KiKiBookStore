const db = require('../database/db')
const utils = require('./Utils')

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
                    })
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    GetBookDetail(id) {
        return new Promise((resolve, reject) => {
            db.ReadBookById(id)
                .then(res => {
                    res.name = utils.UpperWord(res.name)
                    res.author.name = utils.UpperWord(res.author.name)
                    res.publisher.name = utils.UpperWord(res.publisher.name)
                    res.date = new Date(res.date).toLocaleDateString()
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
}

module.exports = new BookController()