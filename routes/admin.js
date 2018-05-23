var express = require('express');
var router = express.Router();
var db = require('../database/db')
var controller = require('../controller/Controller')
var hbs = require('handlebars')

router.get('/',(req,res)=>{
    controller.getBookCount().then((val)=>{
        let data={
            books:val
        }
        res.render("admin",{
            title: 'KikiBookstore Main',
            scripts: ['adminMain.js'],
            admin: true,
            books:val
         })
    })

})
router.get('/Book',(req,res)=>{
    res.render("admin",{
        title: 'KikiBookstore Main',
        scripts: ['adminMain.js'],
        book: true
     })
})


// router.get('/mainform',(req,res)=>{
//     let code = hbs.compile(`{{>adminContent }}`);

//     controller.getBookCount().then((val)=>{
//         let data={
//             book:val
//         }
//         res.setHeader("Content-Type", "text/html");
//         res.send(code(data))
//     })
// })

// router.get('/bookform',(req,res)=>{
//     let code = hbs.compile(`{{>addBookForm }}`);
//     res.setHeader("Content-Type", "text/html");
//     res.send(code())
// })


module.exports = router;