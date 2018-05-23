var express = require('express');
var router = express.Router();
var db = require('../database/db')
var controller = require('../controller/Controller')
var sse = require('server-sent-events')
var nodemailer = require('nodemailer');
router.get('/account/:type',(req,res)=>{
    var Type = req.params.type;
    if(Type == "login"){
        controller.getLogin(req,res)
    }else if(Type == "register"){
        controller.saveAccount(req,res)
    }
})

router.get('/reset', (req, res) => {
    //res.setHeader('Content-Type', 'application/json');
    //controller.getBook(req, res)
    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'letuananhdev@gmail.com',
        pass: ''
    }
    });

    var mailOptions = {
    from: 'letuananhdev@gmail.com',
    to: 'letuananh035@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        res.send(error);
    } else {
        res.send('Email sent: ' + info.response);
    }
    }); 
})
router.get('/book', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    controller.getBook(req, res)
})
  
  router.get('/booktype', (req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    controller.getBookType(req,res)
  })
  
  router.get('/category',(req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    //control
  })
  
  router.get('/media',(req,res)=>{
    controller.getImage(req,res)
  })

  router.get('/test',sse,(req,res)=>{
    controller.test(req,res)
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
  