var express = require("express");
var router = express.Router();
var passport = require("passport");
var flash = require("connect-flash");
const accountController = require('../controller/account')

let info = {
  email: "info@kikibook.com",
  number: "1900000000"
};

router.route("/signup").post(async (req, res, next) => {
  console.log(req.body)
  if (req.body.type == "admin") {
    if (req.session && req.session.passport) {
      let accounttype = false
      console.log('async start')
      await accountController.ReadAccount(req.session.passport.user)
        .then(user => {
          accounttype = user.local.accountType
        })
        .catch(err => {
          res.status(404)
          res.end()
        })


      if (!accounttype) {
        res.status(403)
        res.end()
        return
      }
    }
  }
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
    req.logIn(user, function (err) {
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
  console.log(req.body)
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
        console.log(info)
        return res.send({
          message: info.message
        });
      }
    }
    req.logIn(user, function (err) {
      if (err) {
        res.status(404);
        return res.send({
          message: err
        });
      }
      if (req.body.remember) {
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
  .get((req, res) => {
    req.logout();
    res.redirect('/')
  })

module.exports = router;
