var express = require('express');
var db = require('../database/db')
var router = express.Router();
const categoryController = require('../controller/category')
const authorController = require('../controller/author')
const publisherController = require('../controller/publisher')
const bookController = require('../controller/book')
const accountController = require('../controller/account')
const cartController = require('../controller/cart')
const Account = require('../database/models/AccountModel')
var nodemailer = require('nodemailer');
const utils = require('../controller/Utils')
/*get*/
router.get('/books', (req, res) => {
  let offset = req.query.offset ?
    parseInt(req.query.offset) : 1
  let limit = req.query.limit ?
    parseInt(req.query.limit) : 0
  if (offset === 0) {
    res.status(404)
    res.send({ error: 'Offset > 0' })
    return
  }

  if (offset < 0 || limit < 0) {
    res.status(404)
    res.send({ error: 'Offset > 0' })
    return
  }

  bookController.GetBook(offset, limit)
    .then(val => res.send(val))
    .catch(err => res.send({ error: err }))
})

router.get('/bookcount', (req, res) => {
  bookController.GetBookCount()
    .then(val => res.send(val + ''))
    .catch(err => {
      res.status(404)
      res.send({ error: err })
    })
})

router.get('/category', (req, res, next) => {
  let offset = req.query.offset ?
    parseInt(req.query.offset) : 1
  let limit = req.query.limit ?
    parseInt(req.query.limit) : 0
  let type = req.query.type ?
    req.query.type : 'all'
  if (offset === 0) {
    res.status(404)
    res.send({ error: 'Offset > 0' })
    return
  }

  if (offset < 0 || limit < 0) {
    res.status(404)
    res.send({ error: 'Offset > 0' })
    return
  }
  categoryController.GetList(offset, limit, type)
    .then(val => res.send(val))
    .catch(err => {
      res.status(404)
      res.send({ error: err })
    })
})

router.get('/author', (req, res) => {
  let offset = req.query.offset ?
    parseInt(req.query.offset) : 1
  let limit = req.query.limit ?
    parseInt(req.query.limit) : 0
  if (offset === 0) {
    res.status(404)
    res.send({ error: 'Offset > 0' })
    return
  }

  if (offset < 0 || limit < 0) {
    res.status(404)
    res.send({ error: 'Offset > 0' })
    return
  }
  db.ReadAuthorList(offset, limit)
    .then(val => res.send(val))
    .catch(err => res.send(err))
})

router.get('/publisher', (req, res) => {
  let offset = req.query.offset ?
    parseInt(req.query.offset) : 1
  let limit = req.query.limit ?
    parseInt(req.query.limit) : 0
  if (offset === 0) {
    res.status(404)
    res.send({ error: 'Offset > 0' })
    return
  }

  if (offset < 0 || limit < 0) {
    res.status(404)
    res.send({ error: 'Offset > 0' })
    return
  }
  publisherController.GetList(offset, limit)
    .then(val => {
      res.send(val)
    })
    .catch(err => {
      res.status(404)
      res.send({ error: err })
    })
})

router.get('/booksCategory', (req, res) => {
  let offset = req.query.offset ?
    parseInt(req.query.offset) : 1
  let limit = req.query.limit ?
    parseInt(req.query.limit) : 0
  let id = req.query.id
  if (offset === 0) {
    res.status(404)
    res.send({ error: 'Offset > 0' })
    return
  }

  if (offset < 0 || limit < 0) {
    res.status(404)
    res.send({ error: 'Offset > 0' })
    return
  }

  categoryController.GetBook(offset, limit, id)
    .then(val => res.send(val))
    .catch(err => res.send({ error: err }))
})

router.get('/reset', (req, res) => {
  //res.setHeader('Content-Type', 'application/json');
  //controller.getBook(req, res)
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'letuananhdev@gmail.com',
      pass: '954753855135'
    }
  });

  var mailOptions = {
    from: 'letuananhdev@gmail.com',
    to: 'letuananh035@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.send(error);
    } else {
      res.send('Email sent: ' + info.response);
    }
  });
})



//Comments
router.get('/comments', (req, res) => {
  let id = req.query.id;

  let offset = req.query.offset ?
    parseInt(req.query.offset) : 1
  let limit = req.query.limit ?
    parseInt(req.query.limit) : 0
  if (id == undefined) {
    res.status(404)
    res.send({ error: 'Id empty' })
    return
  }

  if (offset === 0) {
    res.status(404)
    res.send({ error: 'Offset > 0' })
    return
  }

  if (offset < 0 || limit < 0) {
    res.status(404)
    res.send({ error: 'Offset > 0' })
    return
  }

  bookController.GetBookComments(id, offset, limit)
    .then(val => res.send(val))
    .catch(err => res.send(err))
})

router.get('/verify', (req, res) => {
  if (req.query.email && req.query.code) {
    accountController.ReadAccountExt({ "local.email": req.query.email }).then(val => {
      let code = val.local.verify
      if (code == "Active") {
        res.send({ error: 'You already active!' })
        return
      }
      if (code == req.query.code) {
        accountController.UpdateAccount({ find: { "local.email": req.query.email }, update: { $set: { "local.verify": "Active" } } })
          .then(val => {
            res.status(200)
            res.redirect('/');
          }).catch(err => {
            res.status(404)
            res.send({ error: err })
          })
      } else {
        res.send({ error: 'Code not exitst!' })
        return
      }
    })
  } else {
    res.send({ error: 'Must have email' })
    return
  }
})


router.get('/search', (req, res) => {
  let offset = req.query.offset ?
    parseInt(req.query.offset) : 1
  let limit = req.query.limit ?
    parseInt(req.query.limit) : 15
  let option = { name: req.query.name, sort: {} }
  if (req.query.moneyMin && req.query.moneyMax) {
    option.moneyMin = req.query.moneyMin;
    option.moneyMax = req.query.moneyMax;
  }
  if (req.query.type) {
    option.type = req.query.type;
  }
  if (req.query.author) {
    option.author = req.query.author;
  }
  bookController.SearchBookList(offset, limit, option).then(data => {
    res.send(data)
  })
})

/*post*/
/*category*/
router.post('/category', (req, res) => {
  if (req.body.name) {
    let category = {
      name: req.body.name
    }
    categoryController.CheckAndCreate(category)
      .then(() => {
        res.status(200)
        res.send('Success')
      })
      .catch(err => {
        res.status(404)
        res.send({ error: err })
      })
  } else {
    res.status(404)
    res.send({ error: 'Must have name' })
  }
})
/*authors */
router.post('/author', (req, res) => {
  if (req.body.name) {
    let author = {
      name: req.body.name
    }
    authorController.CheckAndCreate(author)
      .then(() => {
        res.status(200)
        res.redirect('/');
      })
      .catch(err => {
        res.status(404)
        res.send({ error: err })
      })
  } else {
    res.status(404)
    res.send({ error: 'Must have name' })
  }
})
/*publisher*/
router.post('/publisher', (req, res) => {
  if (req.body.name) {
    let publisher = {
      name: req.body.name
    }
    publisherController.CheckAndCreate(publisher)
      .then(() => {
        res.status(200)
        res.send('Success')
      })
      .catch(err => {
        res.status(404)
        res.send({ error: err })
      })
  } else {
    res.status(404)
    res.send({ error: 'Must have name' })
  }
})
/*book*/
router.post('/book', (req, res) => {
  if (req.body.name
    && req.body.price
    && req.body.author
    && req.body.category
    && req.body.publisher) {
    bookController.Create(req.body)
      .then(() => {
        res.status(200)
        res.send({ message: 'Success' })
      })
      .catch(err => {
        res.status(404)
        res.send({ error: err })
      })
  } else {
    res.status(404)
    if (!req.body.name) {
      res.send({ error: 'Must have name' })
      return
    }

    if (!req.body.price) {
      res.send({ error: 'Must have price' })
      return
    }

    if (!req.body.author) {
      res.send({ error: 'Must have author' })
      return
    }

    if (!req.body.publisher) {
      res.send({ error: 'Must have publisher' })
      return
    }

    if (!req.body.category) {
      res.send({ error: 'Must have category' })
      return
    }
  }
})
/*Comments*/
router.post('/comments', (req, res) => {
  if (req.body.message
    && req.body.title && req.body.idBook) {
    let dateNow = new Date();
    let idUser = req.session.passport.user;
    db.ReadAccount(idUser).then(val => {
      let data = {
        id: req.body.idBook,
        data: {
          name: val.local.username,
          title: req.body.title,
          message: req.body.message,
          date: dateNow
        }
      }
      bookController.PostComment(data)
        .then(val => res.send(val))
        .catch(err => res.send(err))
    }
    )
      .catch(err => res.send({ error: 'Find name error' }));
  } else {
    res.status(404)
    if (!req.body.message) {
      res.send({ error: 'Must have message' })
      return
    }
    if (!req.body.title) {
      res.send({ error: 'Must have title' })
      return
    }
    if (!req.body.idBook) {
      res.send({ error: 'Must have id book' })
      return
    }
  }
})

router.post('/testCreate', (req, res) => {
  if (req.body.firstName
    && req.body.secondName) {
    let val = {
      firstName: req.body.firstName,
      secondName: req.body.secondName,
      address: req.body.address,
      birthday: req.body.birthday,
      contactNumber: req.body.contactNumber
    }
    accountController.CreateAccountInfo(val)
      .then(val => res.send(val._id))
      .catch(err => res.send({ error: err }))
  }
  else {
    res.status(404)
    if (!req.body.firstName) {
      res.send({ error: 'Must have firstName' })
      return
    }
    if (!req.body.secondName) {
      res.send({ error: 'Must have secondName' })
      return
    }
  }

})

router.post('/updateAccount', (req, res) => {
  if (req.body.firstName
    && req.body.secondName && req.session.passport.user) {
    var update = {
      firstName: req.body.firstName,
      secondName: req.body.secondName,
      address: req.body.address,
      birthday: req.body.birthday,
      contactNumber: req.body.contactNumber
    }
    accountController.ReadAccount(req.session.passport.user).then(account => {
      let passwordNew = req.body.passwordNew;
      if (req.body.passwordNow && req.body.passwordNew) {
        if (!(new Account(account)).validPassword(req.body.passwordNow)) {
          res.send({ error: "Mật khẩu hiện tại nhập sai" })
          return;
        } else {
          passwordNew = (new Account(account)).generateHash(req.body.passwordNew);
        }
      } else {
        passwordNew = account.local.password;
      }
      if (!account.local.accountInfo) {
        accountController.CreateAccountInfo(update)
          .then(data => {
            accountController.UpdateAccount({ find: { _id: req.session.passport.user }, update: { "local.accountInfo": data._id, "local.password": passwordNew } }).then(result => {
              res.send({ message: 'Update Complete!' })
            }).catch(err => res.send({ error: err }))
          })
          .catch(err => res.send({ error: err }))
      } else {
        accountController.UpdateAccount({ find: { _id: req.session.passport.user }, update: { "local.password": passwordNew } }).then(result => {
          accountController.UpdateAccountInfo({
            find: { _id: account.local.accountInfo._id }, update: {
              $set: {
                firstName: req.body.firstName,
                secondName: req.body.secondName,
                address: req.body.address,
                birthday: req.body.birthday,
                contactNumber: req.body.contactNumber
              }
            }
          }).then(result => {
            res.send({ message: 'Update Complete!' })
          }).catch(err => res.send({ error: err }))
        }).catch(err => res.send({ error: err }))
      }
    }).catch(err => res.send(err))
  }
  else {
    res.status(404)
    if (!req.body.firstName) {
      res.send({ error: 'Must have firstName' })
      return
    }
    if (!req.body.secondName) {
      res.send({ error: 'Must have secondName' })
      return
    }
    if (!req.session.passport.user) {
      res.send({ error: 'Must login' })
      return
    }
  }
})

router.post('/verify', (req, res) => {
  if (req.body.email) {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'letuananhdev@gmail.com',
        pass: '954753855135'
      }
    });
    accountController.ReadAccountExt({ "local.email": req.body.email }).then(val => {
      let code = val.local.verify
      let url = "http://" + req.headers.host + "/api/verify?email=" + req.body.email + "&code=" + code;

      var mailOptions = {
        from: 'letuananhdev@gmail.com',
        to: req.body.email,
        subject: 'Active account KikiBook',
        html: '<a href=\"' + url + '\">Click me!</a> </br> or </br><p>' + url + '</p>'
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.send(error);
        } else {
          res.send('Email sent: ' + info.response);
        }
      });
    })
  } else {
    res.send({ error: 'Must have email' })
    return
  }

})


router.route('/cart').post((req, res) => {
  let data = {
    product: req.body.product,
    size: req.body.size
  }
  let tempid = req.body.id
  if (req.session.passport && req.session.passport.user) {
    data.id = req.session.passport.user
  } else {
    tempid = tempid ? tempid : utils.createID()
    data.id = tempid
  }
  cartController.Set(data).then(val => {
    console.log(val)
    if (tempid) {
      res.send({
        id: tempid,
        size: val
      })
    } else {
      res.end()
    }
  }).catch((err) => {
    console.log(err)
    res.end()
  })
})
  .get((req, res) => {
    let tempid = req.query.id
    if (req.session.passport && req.session.passport.user) {
      tempid = req.session.passport.user
    }
    cartController.GetCart(tempid)
      .then(val => {
        res.send(val)
      })
      .catch(err => {
        res.end()
      })
  })

router.route('/cartremoveitem').post((req, res) => {
  let data = {
    product: req.body.product,
    id: req.body.id
  }
  if (req.session.passport && req.session.passport.user) {
    data.id = req.session.passport.user
  }
  console.log(data)
  cartController.Delete(data).then(val => {
    console.log(val)
    res.send({
      size: val
    })
  }).catch((err) => {
    console.log(err)
    res.end()
  })
})

router.route('/savecart').post((req, res) => {
  let data = {
    id: req.body.id,
    list: req.body.list
  }
  if (req.session.passport && req.session.passport.user) {
    data.id = req.session.passport.user
  }
  cartController.SaveCart(data).then(val => {
    console.log(val)
    res.send({
      size: val
    })
  }).catch((err) => {
    console.log(err)
    res.end()
  })
})


router.get('/cartsize', (req, res) => {
  let id = req.query.id ?
    req.query.id : null
  if (req.session.passport && req.session.passport.user) {
    id = req.session.passport.user
  }
  if (id) {
    cartController.GetSize(id)
      .then((result) => {
        res.send(result)
      }).catch((err) => {
        res.status(404)
        res.end()
      });
  } else {
    res.end()
  }
})

router.get('/reset', (req, res) => {

  if (req.body.email) {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'letuananhdev@gmail.com',
        pass: '954753855135'
      }
    });
    accountController.ReadAccountExt({ "local.email": req.body.email }).then(val => {
      let code = val.local.verify
      let url = "http://" + req.headers.host + "/api/verify?email=" + req.body.email + "&code=" + code;

      var mailOptions = {
        from: 'letuananhdev@gmail.com',
        to: req.body.email,
        subject: 'Active account KikiBook',
        html: '<a href=\"' + url + '\">Click me!</a> </br> or </br><p>' + url + '</p>'
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.send(error);
        } else {
          res.send('Email sent: ' + info.response);
        }
      });
    })
  } else {
    res.send({ error: 'Must have email' })
    return
  }

})

module.exports = router;
