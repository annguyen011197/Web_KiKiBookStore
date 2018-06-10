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


}

module.exports = new BookController()