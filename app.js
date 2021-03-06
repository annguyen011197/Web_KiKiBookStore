var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var hbs = require('hbs')
var cors = require('cors')
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
var checkoutRouter = require('./routes/checkout')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
var partialsPath = __dirname+'/views/partials'
hbs.registerPartials(__dirname + '/views/partials')
hbs.registerHelper('section',(name,option)=>{
  this.section[name] = option.fn(this)
})

app.use(logger('dev'))
//app.use(express.json({limit: '4MB'}))
//app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({
  limit: '5mb',
  parameterLimit: 100000,
  extended: false 
}));
app.use(bodyParser.json({
  limit: '5mb'
}));



app.use(session({
  secret: 'webdevteamABBA', // session secret
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session()) 
app.use(flash())
require('./config/passport')(passport)
app.use(cors({credentials: true, origin: 'https://annguyen011197.github.io'}))
//app.use(cors({credentials: true, origin: 'http://localhost:3006'}))
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/api',apiRouter)
app.use('/admin',adminRouter)
app.use('/checkout',checkoutRouter)

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
