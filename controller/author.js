const db = require('../database/db')

class AuthorController{
    CheckAndCreate(value){
        return new Promise((resolve, reject) => {
            db.CheckAuthorAndCreate(value)
            .then(res=>{
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })
        });
    }
}

module.exports = new AuthorController()