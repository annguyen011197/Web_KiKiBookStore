var express = require('express');
var router = express.Router();
var bookController = require('../controller/book')
var accountController = require('../controller/account')
var cartController = require('../controller/cart')
const fs = require('fs')
const path = require('path')
const imageStore = path.join(__dirname, '../database/images')

let info = {
    email: "info@kikibook.com",
    number: "1900000000"
};
router.get('/cart', function (req, res, next) {
    let data = {
        title: "KiKi Bookstore",
        info: info,
        scripts: ["index/script.js", 'script.js']
    };
    if (req.session.passport && req.session.passport.user) {
        let cart = cartController.get(req.session.passport.user)
        let account = accountController.ReadAccount(req.session.passport.user)

        Promise.all([cart, account])
            .then(([cartRes, accountRes]) => {
                data.user = {
                    name: accountRes.local.username,
                    cartlist: cartRes
                }
                res.render('cart', data)
            })
            .catch(err => res.render('cart', data))
    } else {
        let id = req.query.id
        cartController.GetCart(id)
        .then(val=>{
            data.cartlist= val
            res.render('cart', data);
        })
        .catch(err=>res.render('cart', data))
    }
});

module.exports = router;
