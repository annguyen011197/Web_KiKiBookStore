const db = require('../database/db')

class PublisherController{
    CheckAndCreate(value){
        return new Promise((resolve, reject) => {
            db.CheckPublisherAndCreate(value)
            .then(res=>{
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })
        });
    }

    GetList(offset,limit){
        db.ReadPublisherList(offset, limit)
        .then(val => resolve(val))
        .catch(err => reject(err))
    }
}

module.exports = new PublisherController()