var express = require('express');
var router = express.Router();
<<<<<<< HEAD
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
=======

router.route('/')
    .get((req, res) => {
        let data = {
            login : true,
            css: [
                "adminLogin/vendor/bootstrap/css/bootstrap.min.css",
                "adminLogin/fonts/font-awesome-4.7.0/css/font-awesome.min.css",
                "adminLogin/fonts/iconic/css/material-design-iconic-font.min.css",
                "adminLogin/vendor/animate/animate.css",
                "adminLogin/vendor/css-hamburgers/hamburgers.min.css",
                "adminLogin/vendor/animsition/css/animsition.min.css",
                "adminLogin/vendor/select2/select2.min.css",
                "adminLogin/vendor/daterangepicker/daterangepicker.css",
                "adminLogin/css/util.css",
                "adminLogin/css/main.css"
            ],
            scripts: [
                "vendor/jquery/jquery-3.2.1.min.js",
                "vendor/animsition/js/animsition.min.js",
                "vendor/bootstrap/js/popper.js",
                "vendor/bootstrap/js/bootstrap.min.js",
                "vendor/select2/select2.min.js",
                "vendor/daterangepicker/moment.min.js",
                "vendor/daterangepicker/daterangepicker.js",
                "vendor/countdowntime/countdowntime.js",
                "js/main.js"
            ],
        }
        res.render('admin',data)
    })

module.exports = router;
>>>>>>> origin/ltanh2
