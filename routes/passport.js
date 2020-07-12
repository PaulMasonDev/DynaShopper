const express      = require('express'),
      router       = express.Router(),
passport           = require('passport'),
LocalStrategy      = require('passport-local'),
RememberMeStrategy = require('passport-remember-me').Strategy;

// Schema Imports
const User = require("../models/user");

// Passport Config
router.use(passport.initialize());
router.use(passport.session());
router.use(passport.authenticate('remember-me'));

//Strategies
passport.use(new LocalStrategy(User.authenticate()));

passport.use(new RememberMeStrategy(
  function(token, done) {
    Token.consume(token, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user);
    });
  },
  function(user, done) {
    var token = utils.generateToken(64);
    Token.save(token, { userId: user.id }, function(err) {
      if (err) { return done(err); }
      return done(null, token);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = router;