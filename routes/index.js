const express      = require('express'),
      router       = express.Router();

// SCHEMA IMPORTS
const Item = require('../models/item');
const List = require('../models/list');

router.get('/', (req, res) => {
  res.render('landing');
});

router.put('/', (req, res) => { // Takes the item in the input field and adds it to the "default" array.
  List.findOneAndUpdate({name: 'default'}, {$push: {items: req.body.item}}, (err, foundList) =>{
    if(err){
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;