var db = require('../database/db')
let Book = require('../models/BookModel')

class Controller {
    constructor() {
        
    }
    renderHome(req, res) {
        let offset = 0;
        let limit = 10;
        if(req.query.offset != undefined) offset = parseInt(req.query.offset);
        if(req.query.limit != undefined) limit = parseInt(req.query.limit);

        let Books = Array();
        db.LoadBooks(offset,limit, books=>{
            let data = { 
                title: 'KiKi Bookstore',
                info_email: 'info@kikibook.com',
                info_number: '1900000000',
                item: books
            };
            res.render('index',data);
        })
    }

}

module.exports = new Controller();