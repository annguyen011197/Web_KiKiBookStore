const db = require('../database/db')
const utils = require('./Utils')

class CartController {
    SaveCart(value){
        return new Promise((resolve, reject) => {
            db.SaveCart(value).then(val => {
                resolve(val)
            }).catch(err => reject(err))
        });
    }
    Set(value) {
        return new Promise((resolve, reject) => {
            value.size = parseInt(value.size)
            db.SetCart(value).then(val => {
                resolve(val)
            }).catch(err => reject(err))
        });
    }

    Delete(value){
        return new Promise((resolve, reject) => {
            db.DeleteCartItem(value).then(val => {
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
                    let total = 0;
                    (res.books).forEach((e, i, a) => {
                        a[i].size = res.value[e._id]
                        total+=a[i].price*a[i].size
                        a[i].name = utils.UpperWord(e.name)
                        a[i].author.name = utils.UpperWord(e.author.name)
                        a[i].price = (e.price).toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
                        a[i].image.forEach((el,il,al)=>{
                            al[il] = utils.validURL(el) ? el : `/media/${el}`
                        })
                    });
                    res.total =  total
                    console.log(res)
                    resolve(res)
                }).catch((err) => {
                    reject(err)
                });
        });
    }

    Accept(id){
        return new Promise((resolve, reject) => {
            db.AcceptCart(id).then(resolve).catch(reject)
        });
    }

    GetCartList(offset,limit,type){
        return new Promise((resolve, reject) => {
            db.GetCartList(offset,limit,type).then((result) => {
                console.log(result.length)
                for(let j =0;j<result.length;++j){
                    let total = 0
                    console.log(result[j])
                    result[j].books.forEach((e,i,a)=>{
                        a[i].size = result[j].value[e._id]
                        total+=a[i].price*a[i].size
                        a[i].name = utils.UpperWord(e.name)
                        a[i].author.name = utils.UpperWord(e.author.name)
                        a[i].price = (e.price).toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
                        a[i].image.forEach((el,il,al)=>{
                            al[il] = utils.validURL(el) ? el : `/media/${el}`
                        })
                    })
                    result[j].total = total
                }
                console.log(result)
                resolve(result)
            }).catch((err) => {
                reject(err)
            });
        });
    }
}

module.exports = new CartController()