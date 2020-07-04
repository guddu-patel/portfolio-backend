const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');

// import routes
const authAPI = require('./routes/apis/auth');
const postAPI = require('./routes/apis/post');
const contactAPI = require('./routes/apis/contact');

// require database connection
require('./config/db');

// set the view engine to ejs
app.set('view engine', 'ejs');

// initialize CORS middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public/uploads', express.static('public/uploads'));
// app.use(express.static(path.join(__dirname, 'public')));

// use user api routes.
app.use('/api', authAPI);
app.use('/api/posts', postAPI);
app.use('/api/contact', contactAPI);

// first time app open send this response
app.get('/', (req, res) => {
  res.json({
    status: res.statusCode,
    message: "welcome to the Resume API Center"
  });
});

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

  res.json({
    message: err.message,
    error: err
  });

  //res.render('error');
});

module.exports = app;
