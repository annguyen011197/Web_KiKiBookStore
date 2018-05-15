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

    renderCategory(req, res) {
        let offset = 0;
        let limit = 10;
        let type = "Kinh dị";
        if(req.query.offset != undefined) offset = parseInt(req.query.offset);
        if(req.query.limit != undefined) limit = parseInt(req.query.limit);
        if(req.query.type != undefined) type = req.query.type;


        let Books = Array();
        db.LoadBooksCategory(offset,limit,type , books=>{
            let data = { 
                title: 'KiKi Bookstore',
                info_email: 'info@kikibook.com',
                info_number: '1900000000',
                item: books
            };
            res.render('category',data);
        })
    }

}

module.exports = new Controller();