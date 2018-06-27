const db = require('../database/db')
const utils = require('./Utils')

class CartController {
    GetList(val){
        return new Promise((resolve, reject) => {
            db.ReadEventList(val.offset, val.limit)
                .then(res => {
                    res.forEach((e, i, a) => {

                        a[i].image.forEach((el,il,al)=>{
                            al[il] = utils.validURL(el) ? el : `/media/${el}`
                        })
                    })
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        });
    }
    CreateEvent(val){
        return new Promise((resolve, reject) => {
            db.CreateEvent(val)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        });
    }
}

module.exports = new CartController()