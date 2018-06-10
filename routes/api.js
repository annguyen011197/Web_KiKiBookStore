var express = require('express');
var db = require('../database/db')
var router = express.Router();
const categoryController = require('../controller/category')
const authorController = require('../controller/author')
const publisherController = require('../controller/publisher')
const bookController = require('../controller/book')

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
  publisherController(offset,limit)
  .then(res=>res.send(res))
  .catch(err=>{
    res.status(404)
    res.send({error:err})
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

  categoryController.GetBook(offset,limit,id)
  .then(val=>res.send(val))
  .catch(err=>res.send({error:err}))
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
        res.send('Success')
      })
      .catch(err => {
        res.status(404)
        res.send({ error: err })
      })
  } else {
    res.status(404)
    if (req.body.name) {
      res.send({ error: 'Must have name' })
      return
    }

    if (req.body.price) {
      res.send({ error: 'Must have price' })
      return
    }

    if (req.body.author) {
      res.send({ error: 'Must have author' })
      return
    }

    if (req.body.publisher) {
      res.send({ error: 'Must have publisher' })
      return
    }

    if (req.body.category) {
      res.send({ error: 'Must have category' })
      return
    }
  }
})
module.exports = router;
