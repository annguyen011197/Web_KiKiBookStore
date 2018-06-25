const db = require('../database/db')

class AccountController{
    ReadAccount(value){
        //console.log(value)
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

    async ReadAccountAsync(value){
        let user = null
        let error = null
        await db.ReadAccount(value)
        .then(res=>  user = res)
        .then(err=> error = err)
        console.log('User')
        console.log(user)
        return user
    }
}

module.exports = new AccountController()