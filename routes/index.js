var express = require('express');
var router = express.Router();
var db = require('../database/db')
var controller = require('../controller/Controller')
/* GET home page. */
router.get('/', function(req, res, next) {
  controller.renderHome(req, res);
  // res.render('index', { 
  //   title: 'KiKi Bookstore',
  //   info_email: 'info@kikibook.com',
  //   info_number: '1900000000',
  //   item: [
  //     {
  //       image:'https://vcdn.tikicdn.com/cache/280x280/ts/product/9c/10/12/1efc0ff76e2d73a537d058f720234d18.jpg',
  //       name:'Gửi Thanh Xuân Ấm Áp Của Chúng Ta (Tập 1 Và 2)',
  //       author:'Triệu Kiền Kiền',
  //       finalPrice:'200.000 đ',
  //       regularPrice:'100.000 đ',
  //       saleTag:'50%'
  //     },
  //     {
  //       image:'https://vcdn.tikicdn.com/cache/200x200/ts/product/fb/2b/b3/1a4d1ae88a03f6c03d24999aa2055d35.jpg',
  //       name:'Truyện Tranh Ehon - Kerolympic',
  //       author:'Etsuko Ohara',
  //       finalPrice:'200.000 đ',
  //       regularPrice:'100.000 đ',
  //       saleTag:'50%'
  //     },
  //     {
  //       image:'https://vcdn.tikicdn.com/cache/200x200/ts/product/65/b2/ce/00ae95e7b629733054aa661caa7be486.jpg',
  //       name:'Truyện Tranh Ehon - Hạt Dưa Hấu',
  //       author:'Sato Wakiko',
  //       finalPrice:'200.000 đ',
  //       regularPrice:'100.000 đ',
  //       saleTag:'50%'
  //     },

  //   ]
  // });
});

router.get('/book',(req,res)=>{
  controller.renderHome(req, res);
})

router.get('/category',(req,res)=>{
  controller.renderCategory(req, res);
})



process.on('SIGINT', function() {
  console.log("Caught interrupt signal");
  db.CloseDb()
  process.exit()
});
//TODO:Query Data và add vào index
module.exports = router;
