<<<<<<< HEAD
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin')
var app = express();
var hbs = require('hbs');
var partialsPath = __dirname+'/views/partials'
=======
var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var hbs = require('hbs')
//for auth
var passport = require("passport")
var flash = require("connect-flash")
var session = require("express-session")
var mongoose = require("mongoose")
var bodyParser = require('body-parser')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var apiRouter = require('./routes/api')
var adminRouter = require('./routes/admin')

var app = express()

>>>>>>> origin/ltanh2
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
var partialsPath = __dirname+'/views/partials'
hbs.registerPartials(__dirname + '/views/partials')
hbs.registerHelper('section',(name,option)=>{
  this.section[name] = option.fn(this)
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

<<<<<<< HEAD
app.use('/', indexRouter);
app.use('/users', usersRouter);
=======

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'webdevteamABBA', // session secret
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session()) 
app.use(flash())
require('./config/passport')(passport)

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/api',apiRouter)
>>>>>>> origin/ltanh2
app.use('/admin',adminRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
