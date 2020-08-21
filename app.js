var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session'); 
const passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//Passport Config
require('./config/passport')(passport);

//DB config
const db= require('./config/keys').MongoURI;
// Connect to Mongo
mongoose.connect(db, {useNewUrlParser:true, useUnifiedTopology: true})
.then(()=>console.log("Mongodb go brr..."))
.catch(err=> console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Express Session
app.use(
  session({
    secret: 'secret2',
    resave: true,
    saveUninitialized: true
  })
);


// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


//Connect Flash
app.use(flash());

//Globar vars
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
