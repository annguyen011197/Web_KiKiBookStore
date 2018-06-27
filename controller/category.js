const db = require('../database/db')
const utils = require('../controller/Utils')

class CategoryController {
    CheckAndCreate(value) {
        return new Promise((resolve, reject) => {
            db.CheckCategoryAndCreate(value)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        });
    }

    GetList(offset, limit, type) {
        return new Promise((resolve, reject) => {
            switch (type) {
                case 'all':
                    db.ReadCategoryList(offset, limit)
                        .then(res => {
                            res.forEach((e, i, a) => {
                                a[i].name = utils.UpperWord(e.name)
                                a[i].size = e.books.length
                            });
                            resolve(res)
                        })
                        .catch(err => reject(err))
                    break
                case 'name':
                    db.ReadCategoryListName(offset, limit)
                        .then(res => {
                            let value = []
                            res.forEach(element => {
                                let temp = element.toJSON()
                                temp.name = utils.UpperWord(temp.name)
                                value.push(temp)
                            });
                            resolve(value)
                        })
                        .catch(err => reject(err))
                    break
            }
        })
    }

    GetBook(offset,limit,id) {
        return new Promise((resolve, reject) => {
            db.ReadBookListType(id)
            .then(res=>{
                res.count = res.books.length;
                res.name = utils.UpperWord(res.name)
                res.books.forEach((e,i,a) => {
                    a[i].name = utils.UpperWord(e.name)
                    a[i].author.name = utils.UpperWord(e.author.name)
                    a[i].image.forEach((el,il,al)=>{
                        al[il] = utils.validURL(el) ? el : `/media/${el}`
                        console.log(al[il])
                    })
                });
                res.books = res.books.slice((offset - 1) * limit, offset * limit);
                resolve(res)
            })
            .catch(err=>reject(err))
        });
    }
}

module.exports = new CategoryController()