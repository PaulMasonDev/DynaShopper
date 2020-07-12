const express      = require('express'),
      router       = express.Router();

// SCHEMA IMPORTS
const Item = require('../models/item');
const List = require('../models/list');
const MasterList = require('../models/masterlist');

router.get('/testing', (req, res) => {
    
});

router.get('/', (req, res) => {
  if(req.user){
    List.find({author: req.user._id}, (err, foundList) => {
      console.log('List of all lists that have been authored by you', foundList);
      if(foundList){
        res.render('landing', {list: foundList})
      } else {
        res.render('landing', {list: []})
      }
    });
  } else {
      res.render('landing', {list:[]})
  }   
});

router.put('/', (req, res) => { 
  MasterList.findOne({items: req.body.item}, (err, foundList) => { // Look for item in the Master list available to all users.
    if(err){
      console.log(err)
    } else {
      if(!foundList){ // If no master list is found, than user creates one
        res.render('createList', {item: req.body.item});
      } else if(foundList){ // If a master list has the item in it
        List.findOne({name: foundList.name, author: req.user._id}, (err, foundPersonalList) => { // Check to see if there is already a personal list with the same category name
          if(err){
            console.log(err);
          } else if(foundPersonalList){ // If there is already a personal list, push the item into the items array of that list and redirect to home.
            List.findByIdAndUpdate(foundPersonalList._id, {$push: {items: req.body.item}}, (err, list)=> {
              if(err){
                console.log(err);
              } else {
                res.redirect('/'); 
              }
            });
          } else { // Otherwise create a brand new list with the item in it.
              List.create({
                name: foundList.name,
                items: [req.body.item],
                author: req.user._id
              });
              res.redirect('/');
          } 
        });
      }
    }
  });
});

router.get('/createList', (req, res) => {
  res.render('createList');
});

router.put('/createList', (req, res) => {
  MasterList.findOne({name: req.body.list}, (err, foundMasterList) => { //See if a master list with the same name is already existing
    if(err){
      console.log(err)
    } else if(foundMasterList){ // If there is an existing list with that name, push the item into the items array.
        MasterList.findOneAndUpdate({name: req.body.list}, {$push: {items: req.body.item}}, (err, found) => {
          if(err){
            console.log(err);
          }
        });
      } else {
        //create new Master list
          MasterList.create({
            name: req.body.list,
            items: [req.body.item]
          }, (err) => {
            if(err){
              console.log(err);
            } 
          });   
      } // And then check to see if you already have a personal list of that type
      List.findOne({name:req.body.list, author: req.user._id}, (err, foundPersonalList) => {
      if(err){
        console.log(err);
      } else if(foundPersonalList){ // If it exists, push the new item into the items array
        console.log('PUTTING')
        List.findOneAndUpdate({name:req.body.list, author: req.user._id}, {$push: {items:req.body.item}}, (err, item) => {
          if(err){
            console.log(err);
          }
        });
      } else { // If it doesn't exist, create a new list and push the item in the items array.
      console.log('NOT PUTTING');
        List.create({
          name: req.body.list,
          author: req.user._id,
          items: [req.body.item]
        });
      }
      res.redirect('/'); // Go back to the home
    });           
        }
      );     
    });


module.exports = router;