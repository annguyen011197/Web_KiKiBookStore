const db = require('../database/db')

class CartController{
    Set(value){
        return new Promise((resolve, reject) => {
            value.size = parseInt(value.size)
            db.SetCart(value).then(val=>{
                resolve(val)          
            }).catch(err=>reject(err))
        });
    }

    GetSize(value){
        return new Promise((resolve, reject) => {
          db.GetSizeCart(value)
          .then((result) => {
            resolve(result)
          }).catch((err) => {
              reject(err)
          });
        })
    }
    
    GetCart(value){
        return new Promise((resolve, reject) => {
            db.GetCartInfo(value)
            .then((result) => {
                console.log(result)
            }).catch((err) => {
                reject(err)
            });
        });
    }
}

module.exports = new CartController()