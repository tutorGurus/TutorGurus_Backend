let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');
let envError = require('./src/errorHandler/envError');
let swaggerUI = require('swagger-ui-express');
let swaggerFile = require('./swagger-output.json');
require('./src/errorHandler/processError')();
if(process.env.NODE_ENV.trim() === 'dev'){
  require('dotenv').config({path : './config.env'})
} else {
  require('dotenv').config({path : "/etc/secrets/config.env"});
}
require('./src/service/mongoConnect')();


let app = express();

let indexRouter = require('./routes/index');
let studentRouter = require('./routes/studentRoutes'); 
let tutorsRouter = require('./routes/tutorsRoutes');
let carts = require('./routes/cartRoutes');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/student', studentRouter);
app.use('/tutors', tutorsRouter);
app.use('/cart', carts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  //dev
  if(process.env.NODE_ENV.trim() === "dev"){
    return envError.devError(err, res);
  }
  //production
  if(err.name === "validationError"){
    err.message = "資料欄位未填寫正確！";
    err.isOperational = true;
    return envError.productError(err, res);
  }
  envError.productError(err, res);
  
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
