var express = require('express');
var router = express.Router();
var accountController = require('../controller/account')

router.route('/')
    .get((req, res) => {
        let data = {
            login: true,
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
        if (req.session.passport) {
            if(req.session.passport.user){
                accountController.ReadAccount(req.session.passport.user)
                .then(user=>{
                    if (user.local.accountType) {
                        data.login = false
                        data.user = user
                        data.scripts = [
                            'admin/script.js'
                        ]
                        data.css = ['css/style-admin.css']
                        data.admin = true
                        res.render('admin', data)
                    }else{
                        res.redirect('/')
                    }
                })
                .catch(err=>{
                    console.log(err)
                    res.redirect('/')
                    //res.render('', data)
                })
            }else{
                res.render('', data)
            }

        return
        }
        res.render('admin', data)
    })

module.exports = router;
