/* eslint-disable no-console */

const express = require('express');
const  {engine} = require('express-handlebars');
const path = require('path');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const dbconnection=require('./config/connection')

const app = express();
const port=3000;

const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');

// Database connection
dbconnection();

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// static directory
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({secret:"hello",
saveUninitialized: true, resave: false}))


app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})



// routers

app.use('/admin', adminRouter);
app.use('/user', userRouter);

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', engine({
  defaultLayout: 'layout',
  extname: '.hbs',
  layoutsDir:`${__dirname}/views/layout`,
  partialsDir:`${__dirname}/views/partials`
}));



app.listen(port, () => {
    console.log(`App listening at port ${port}`)
  })