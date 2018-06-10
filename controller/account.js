const db = require('../database/db')

class AccountController{
    ReadAccount(value){
        console.log(value)
        return new Promise((resolve, reject) => {
            db.ReadAccount(value)
            .then(res=>{
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })
        });
    }
}

module.exports = new AccountController()