var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index');

var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var bcrypt = require('bcrypt');
var flash = require('connect-flash')
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes/index');
var userRoutes = require('./routes/user')

mongoose.connect(`mongodb+srv://roypa81130:royparakkan123a@cluster0.zjtqe.mongodb.net/department?retryWrites=true&w=majority`, {useNewUrlParser:true, useUnifiedTopology: true}, (err) =>{
 if (err)
     console.log(err);
 else
     console.log("connected to mongodb")
});
require('./config/passport');

var app = express();

// view engine setup
app.set("view engine", "handlebars");
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "layout",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    extname:'.hbs'
  })
);
app.set("view engine", ".hbs");


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret:'mysupersecret', 
  resave: false, 
  saveUninitialized:false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session
  next(); 
});

//app.use('/', indexRouter);

app.use('/user', userRoutes)
app.use('/', routes);



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
