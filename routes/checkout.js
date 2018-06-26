var express = require('express');
var router = express.Router();
var bookController = require('../controller/book')
var accountController =require('../controller/account')

router.get('/cart',(req,res)=>{
    let id = req.query.id
    
})

module.exports = router