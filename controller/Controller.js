var db = require('../database/db')
let Book = require('../models/BookModel')
var fs = require('fs')
var path =require('path')
var image = require('./Image')
let mediaPath = '../'

let info ={
    email: 'info@kikibook.com',
    number: '1900000000'
}

class Controller {
    constructor() {
        
    }
    renderHome(req, res) {
        let data = {
            title: 'KiKi Bookstore',
            info: info
        };
        res.render('index', data);
    }

    renderDetail(req,res) {
        let id = ''
        console.log(req.query)
        if (req.query.id != undefined) id = req.query.id
        db.LoadBook(id,book=>
        res.render('detail',{
            title: book.name,
            info: info,
            item: book
        })
        )
    }

    getBook(req, res) {
        let offset = 0;
        let limit = 10;
        if (req.query.offset != undefined) offset = parseInt(req.query.offset);
        if (req.query.limit != undefined) limit = parseInt(req.query.limit);

        let Books = Array();
        db.LoadBooks(offset, limit, books => {
            res.send(JSON.stringify(books))
        })
    }

    getBookType(req, res) {
        let offset = 0
        let limit = 6
        if (req.query.offset != undefined) offset = parseInt(req.query.offset);
        if (req.query.limit != undefined) limit = parseInt(req.query.limit);

        db.LoadBookTypes(offset, limit, booktypes => {
            res.send(JSON.stringify(booktypes))
        })
    }

    getImage(req, res) {
        let name = 'null.jpg'
        // let height  = 200;
        // let width = 200;
        if (req.query.name != undefined ) name = req.query.name 
        // if (req.query.height != undefined ) height = parseInt(req.query.height ) 
        // if (req.query.width != undefined ) height = parseInt(req.query.width )
        // image.resizeImage(name,height,width,data=>{
        //     res.setHeader("Content-Type", "image/png")
        //     res.end(data,'binary')
        // })
        res.setHeader("Content-Type", "image/jpeg")
        res.sendFile(path.join(__dirname,'../media',name))
    }

    test(req,res) {
        let offset = 0;
        let limit = 10;
        if (req.query.offset != undefined) offset = parseInt(req.query.offset);
        if (req.query.limit != undefined) limit = parseInt(req.query.limit);

        db.Test(offset,limit,books=>{
            res.send(books)
        })
    }

}

module.exports = new Controller();