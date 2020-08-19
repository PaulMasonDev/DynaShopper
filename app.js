const express            = require('express'),
      app                = express(),
      bodyParser         = require('body-parser'),
      expressSanitizer   = require('express-sanitizer'),
      methodOverride     = require('method-override'),
      mongoose           = require('mongoose'),
      flash              = require('connect-flash'),
      passport           = require('passport'),
      cookieParser       = require('cookie-parser'),
      favicon            = require('express-favicon'),
      LocalStrategy      = require('passport-local');


require('dotenv').config();

app.use(favicon(__dirname + '/public/favicon.ico'));

// Schema Imports
const User = require('./models/user');

// Environmental variables
const port = process.env.PORT;
const host = process.env.HOST;
const databaseUrl = process.env.DATABASEURL || process.env.MONGO_URL

// Mongoose Connect
mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(()=> {
  console.log('Connected to DB');
}).catch(err => {
  console.log('Error:' + err.message);
});

app.use(require("express-session")({
  secret: "We are the champions my friend",
  resave: false,
  saveUninitialized: false
}));

// Passport Config
app.use(passport.initialize());
app.use(passport.session());


//Strategies
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(express.static('public'));

// Route Imports

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');

app.use('/', indexRoutes);
app.use('/', authRoutes);

// Listening
app.listen(port || 3007, (req, res) => {
  console.log("Listening on port " + port);
  
});