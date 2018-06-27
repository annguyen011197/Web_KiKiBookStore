var express = require('express');
var router = express.Router();
var bookController = require('../controller/book')
var accountController =require('../controller/account')
const fs = require('fs')
const path = require('path')
const imageStore = path.join(__dirname,'../database/images')

let info = {
  email: "info@kikibook.com",
  number: "1900000000"
};

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.session)
  let data = {
    title: "KiKi Bookstore",
    info: info,
    scripts: ["index/script.js",'script.js']
  };
 if(req.session.passport){
    accountController.ReadAccount(req.session.passport.user)
    .then((value)=>{
      console.log(value.local.verify)
      if(value.local.verify=='Active'){
        data.user = {
          name: value.local.username
        }
      }
      res.render('index', data);
    })
    .catch(err=>{
      res.render('index', data);
    })
 }else{
  res.render('index', data);
 }
});

router.get('/category', (req, res) => {
  let data = {
    title: "KiKi Bookstore",
    info: info,
    scripts: ["category/script.js","script.js"]
  };
  res.render('index', data);
})

router.get('/search', (req, res) => {
  let data = {
    title: "KiKi Bookstore",
    info: info,
    scripts: ["search/script.js"]
  };
  res.render('index', data);
})

router.get('/account', (req, res) => {
  if(req.session.passport){
    accountController.ReadAccount(req.session.passport.user)
    .then((value)=>{
      if(value.local.verify !='Active'){
        res.redirect('/')
      }
      value.local.password = ''
      let data = {
        title: "KiKi Bookstore",
        info: info,
        scripts: ["account/script.js"],
        account: value
      };
      if(value.accountInfo != undefined){
        console.log(value.accountInfo)
      }
      res.render("account",data);
    })
    .catch(err=>{
      res.send("404");
    })
 }else{
  let data = {
    title: "KiKi Bookstore",
    info: info,
    scripts: ["account/script.js"],
  };
  res.redirect('/')
  //res.render("index",data);
 }
})

router.get('/details', (req, res) => {
  let id = req.query.id
  if(req.session.passport){
    accountController.ReadAccount(req.session.passport.user)
    .then((value)=>{
      bookController.GetBookDetail(id)
      .then(val => {
        let data = {
          id: id,
          title: "KiKi Bookstore",
          info: info,
          scripts: ["detail/script.js","script.js"],
          item: val
        }

        if(value){
          if(value.local.verify=='Active'){
            data.user = {
              name: value.local.username
            }
          }
        }
        res.render('detail', data)
      })
    })
    .catch(err=>{
      bookController.GetBookDetail(id)
      .then(val => {
        let data = {
          id: id,
          title: "KiKi Bookstore",
          info: info,
          scripts: ["detail/script.js","script.js"],
          item: val
        }
        data.user = {
          name: value.local.username
        }
        res.render('detail', data)
      })
    })
 }else{
  bookController.GetBookDetail(id)
  .then(val => {
    let data = {
      id: id,
      title: "KiKi Bookstore",
      info: info,
      scripts: ["detail/script.js","script.js"],
      item: val
    }
    res.render('detail', data)
  })
 }})

router.get('/media/:name',(req,res)=>{
  let name = req.params.name
  res.sendFile(path.join(imageStore,name))
})


router.get('/cart', (req, res) => {
  res.render('cart');
})

module.exports = router;
