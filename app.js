var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var csrf = require('csurf');
const MongoStore = require('connect-mongo')(session);
var socket = require('socket.io');


var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var apiRouter = require('./api/api');

var Category = require('./models/category');

var app = express();

//Mongoose Connection
mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true } );
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');


app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({secret: 'mysecretsession', resave: false, saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie:{maxAge:120 * 60 * 100}
}));
app.use(csrf());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

/*Creating a middleware that will be executed in all request while registering the users,
storing the seesion and generating the CSRF tokens*/
app.use(function(req, res, next){
  res.locals.userRegistered = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals._token = req.csrfToken();
  next();
});

//Adding a Category middleware inorder to helps users to find the category they are searching
app.use(function (req, res, next) {
  Category.find({}, function(err, categories){
  if(err) return next(err);
  res.locals.categories = categories;
  next();
  });
});

app.use('/user', userRouter);
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/api', apiRouter);




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

//Adding the chat functionality
var server=app.listen(4000, function(){
    console.log('listening to port 4000.....')
});
//Static files
app.use(express.static('public'));

//Socket setup
var io=socket(server);

io.on('connection',function(socket){
    console.log('made socket connection', socket.id);

    socket.on('chat',function(data){
        //console.log(data);
        io.sockets.emit('chat',data)
    });
    socket.on('typing', function(data){
        socket.broadcast.emit('typing',data);
    });
});

module.exports = app;
