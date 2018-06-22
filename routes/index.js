var express = require('express');
var router = express.Router();
var bookController = require('../controller/book')
var accountController =require('../controller/account') 

let info = {
  email: "info@kikibook.com",
  number: "1900000000"
};

/* GET home page. */
router.get('/', function (req, res, next) {
  let data = {
    title: "KiKi Bookstore",
    info: info,
    scripts: ["index/script.js"]
  };
 if(req.session.passport){
    accountController.ReadAccount(req.session.passport.user)
    .then((value)=>{
      data.user = {
        name: value.local.username
      }
      console.log(data)
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
    scripts: ["category/script.js"]
  };
  res.render('index', data);
})

<<<<<<< HEAD
router.get('/category',(req,res)=>{
  controller.renderCategory(req, res);
})

// router.get('/admin',(req,res)=>{
//   controller.renderAdmin(req,res);
// })

/*api */
router.get('/api/book', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  controller.getBook(req, res)
})

router.get('/api/booktype', (req,res)=>{
  res.setHeader('Content-Type', 'application/json');
  controller.getBookType(req,res)
})

router.get('/api/category',(req,res)=>{
  res.setHeader('Content-Type', 'application/json');
  control
})

router.get('/api/media',(req,res)=>{
  controller.getImage(req,res)
})

router.get('/api/test',sse,(req,res)=>{
  controller.test(req,res)
})

/*html*/
router.get('/html/book',(req,res)=>{
  controller.getBookContent(req,res)
})

router.get('/html/booktype',(req,res)=>{
  controller.getBookTypeContent(req,res)
})

router.get('/html/bookcategory',sse,(req,res)=>{
  controller.getAllBookCategory(req,res)
})


process.on('SIGINT', function () {
  console.log("Caught interrupt signal");
  db.CloseDb()
  process.exit()
});

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});
=======
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
          scripts: ["index/script.js"],
          item: val
        }
        data.user = {
          name: value.local.username
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
          scripts: ["index/script.js"],
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
      scripts: ["index/script.js"],
      item: val
    }
    res.render('detail', data)
  })
 }})
>>>>>>> origin/ltanh2
module.exports = router;
