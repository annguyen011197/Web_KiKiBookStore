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

// router.get('/admin',(req,res)=>{
//   controller.renderAdmin(req,res);
// })

/*api */


// router.get('/api/account',(req,res)=>{
//   controller.getLogin(req,res)
// })

// router.get('/api/register',(req,res)=>{
//   controller.saveAccount(req,res)
// })



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
