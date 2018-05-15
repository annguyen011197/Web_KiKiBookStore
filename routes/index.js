var express = require('express');
var router = express.Router();
var db = require('../database/db')
var controller = require('../controller/Controller')
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


/*api */
router.get('/api/book', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  controller.getBook(req, res)
})

router.get('/api/booktype', (req,res)=>{
  res.setHeader('Content-Type', 'application/json');
  controller.getBookType(req,res)
})

router.get('/api/media',(req,res)=>{
  controller.getImage(req,res)
})

router.get('/api/test',(req,res)=>{
  controller.test(req,res)
})

process.on('SIGINT', function () {
  console.log("Caught interrupt signal");
  db.CloseDb()
  process.exit()
});
//TODO:Query Data và add vào index
module.exports = router;
