const db = require('../database/db')
const utils = require('./Utils')

class CartController {
    Set(value) {
        return new Promise((resolve, reject) => {
            value.size = parseInt(value.size)
            db.SetCart(value).then(val => {
                resolve(val)
            }).catch(err => reject(err))
        });
    }

    GetSize(value) {
        return new Promise((resolve, reject) => {
            db.GetSizeCart(value)
                .then((result) => {
                    resolve(result)
                }).catch((err) => {
                    reject(err)
                });
        })
    }

    GetCart(value) {
        return new Promise((resolve, reject) => {
            db.GetCartInfo(value)
                .then((res) => {
                    (res.books).forEach((e, i, a) => {
                        a[i].name = utils.UpperWord(e.name)
                        a[i].author.name = utils.UpperWord(e.author.name)
                        a[i].price = (e.price).toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
                        a[i].image.forEach((el,il,al)=>{
                            al[il] = utils.validURL(el) ? el : `/media/${el}`
                        })
                    });
                    resolve(res)
                }).catch((err) => {
                    reject(err)
                });
        });
    }
}

module.exports = new CartController()