const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

const PORT = process.env.PORT || 5000;

//Passport config
require('./config/passport')(passport);

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Express Body-parser
app.use(express.urlencoded({ extended: false}));

//DB Config
const db= require('./config/keys').mongoDbURI;

//Connect to mongodb
mongoose.connect(db, { useNewUrlParser: true})
.then( () => console.log("connected to Mongodb..."))
.catch(err => console.log(err))


//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false
    
  }));
  
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
  
//Connect falsh
app.use(flash());

//Global var
app.use((req, res , next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/',require("./routes/index") );
app.use('/users', require("./routes/users"));

app.listen(PORT, console.log(`server started on port: ${PORT}`))