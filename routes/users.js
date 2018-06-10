var express = require("express");
var router = express.Router();
var passport = require("passport");
var flash = require("connect-flash");

let info = {
  email: "info@kikibook.com",
  number: "1900000000"
};

router.route("/signup").post((req, res, next) => {
  passport.authenticate("local-signup", (err, user, info) => {
    if (err) {
      res.status(404);
      return res.send({
        message: err
      });
    }
    if (!user) {
      res.status(404);
      return res.send({
        message: err
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        res.status(404);
        return res.send({
          message: err
        });
      }
      res.status(200);

      return res.send({
        message: "Succesfully",
        code: 0
      });
    });
  })(req, res, next);
});

router.route("/login").post((req, res) => {
  passport.authenticate("local-login", (err, user, info) => {
    if (err) {
      res.status(404);
      return res.send({
        message: err
      });
    }
    if (!user) {
      if (info) {
        res.status(401);
        return res.send({
          message: info.message
        });
      }
    }
    req.logIn(user, function(err) {
      if (err) {
        res.status(404);
        return res.send({
          message: err
        });
      }
      console.log(req.body.remember)
      if(req.body.remember){
        //30 days
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000
      }
      res.status(200);
      return res.send({
        message: "Succesfully",
        code: 0
      });
    });
  })(req, res);
});

router.route('/logout')
.get((req,res)=>{
  req.logout()
  res.render('index');
})

module.exports = router;
