const passport = require('passport'),
      User = require('../models/user'),
      express      = require('express'),
      router       = express.Router();

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate("local", {
  successRedirect: "/", // Or other starting page after logging in
  successFlash: "You have successfully logged in.",
  failureRedirect: "/login",
  failureFlash: true,
  failureFlash: "Your username or password is incorrect.  Please try again.",
}), (req, res) => {
  console.log('logged in');
  res.redirect('/');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  let newUser = new User({
    username: req.body.username,
    email: req.body.email
  });

  User.register(newUser, req.body.password, (err, user) => {
    if(err){
      console.log(err);
    } 
    passport.authenticate("local")(req, res, () => {
      res.redirect('/');
    });         
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;