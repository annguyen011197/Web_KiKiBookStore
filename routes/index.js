var express = require('express');
var router = express.Router();
var db = require('../database/db')
var controller = require('../controller/Controller')
var sse = require('server-sent-events')
/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.query)
  controller.renderHome(req, res);
});

router.get('/details',(req,res,next)=>{
  controller.renderDetail(req,res)
})

router.get('/bookstore', (req, res) => {
  //controller.renderHome(req, res);
  let data = {
    title: 'KiKi Bookstore',
    info: {
      email: 'info@kikibook.com',
      number: '1900000000'
    }
  };
  res.render('index', data);
})

router.get('/category',(req,res)=>{
  controller.renderCategory(req, res);
})

router.get('/admin',(req,res)=>{
  controller.renderAdmin(req,res);
})

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
module.exports = router;
