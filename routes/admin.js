var express = require('express');
var router = express.Router();
var db = require('../database/db')
var controller = require('../controller/Controller')

router.get('/',(req,res)=>{
   controller.renderAdmin().then((val)=>{
      res.render("admin",{
          book: val
      })
   })
})

module.exports = router;