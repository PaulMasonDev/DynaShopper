const express      = require('express'),
      router       = express.Router();

// SCHEMA IMPORTS
const Item = require('../models/item');
const List = require('../models/list');
const MasterList = require('../models/masterlist');


// const list = new List({});
// list.save();

router.get('/', (req, res) => {
  List.findOne({name: 'default'}, (err, foundList) => {
    if(err){
      console.log(err);
    } else {
        res.render('landing', {items: foundList.items});
      }
  });  
});
// const list = new List({
//   name: 'dairy'
// });
// list.save();

router.put('/', (req, res) => { 
  List.findOne({items: req.body.item}, (err, foundList) => {
    if(err){
      console.log(err)
    } else {
      if(!foundList){
        res.render('createList', {item: req.body.item});
        
        //Is it a master? Yes create local instance and then:
        
        //Is local instance of list made?
          //If yes, push items to list
          //else create a local list
          //then push item to list
          //then redirect
      } else if(foundList && !foundList.isMaster){

      } else {
        //ask user for list name and create and also create a local instance and push item to list
      }
      // res.redirect('/');
    }
  });
});

router.get('createList', (req, res) => {
  res.render('createList');
});

router.put('/createList', (req, res) => {
  MasterList.create({name: req.body.list}, (err) => {
    if(err){
      console.log(err);
    } else { 
      MasterList.findOneAndUpdate({name: req.body.list},{$push: {items: req.body.item}}, (err, foundList) => {
        if(err){
          console.log(err);
        } else{
          List.create({
            name: req.body.list,
            author: req.user._id,
            items: [req.body.item]
          });
          res.redirect('/');
        }
      });     
    }
  });
});

module.exports = router;