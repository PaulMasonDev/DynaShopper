const express      = require('express'),
      router       = express.Router();
      

// SCHEMA IMPORTS
const Item = require('../models/item');
const PersonalList = require('../models/personallist');
const MasterList = require('../models/masterlist');
const { findOneAndDelete } = require('../models/item');

router.get('/testing', (req, res) => {
    
});
// SHOW All your Lits
router.get('/', (req, res) => {
  if(req.user){
    PersonalList.find({author: req.user._id}, (err, foundList) => {
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

// UPDATE LISTS WITH ITEMS
router.put('/', (req, res) => {
  const newItem = req.body.item;
  let foundMatch = false; // Init match Boolean
  MasterList.find({}, (err, allLists) => { //Lookup all lists  
    allLists.forEach((list) => {
      if(foundMatch === true){ // Break if match has already been found
        return;
      }
      list.items.forEach((item) => {
        if(newItem.includes(item)){ //if item is part of new item
          foundMatch = true; // set boolean so loop can break
          newListName = list.name;; // set the list name to be the list name that     matched the item
        }
      });
    });

    MasterList.findOne({$or: [
      {items: newItem},
      {name: newListName}
    ]}, 
    (err, foundList) => { // Look for item in the Master list available to all users.
      if(err){
        console.log(err)
      } else if(foundList){
        PersonalList.findOne({name: foundList.name, author: req.user._id}, (err, foundPersonalList) => { // Check to see if there is already a personal list with the same category name
          if(err){
            console.log(err);
          } else if(foundPersonalList){ // If there is already a personal list, push the item into the items array of that list and redirect to home.
            PersonalList.findOneAndUpdate({name: foundList.name, author: req.user._id}, {$push: {items: newItem}}, (err, list)=> {
              if(err){
                console.log(err);
              } else {
                res.redirect('/'); 
              }
            });
          } else { // Otherwise create a brand new list with the item in it.
              PersonalList.create({
                name: foundList.name,
                items: [newItem],
                author: req.user._id
              });
              res.redirect('/');
          } 
        });
      } else {
        res.render('createList', {item: req.body.item});
      }
    });
  });  
});

//CREATE LIST
router.get('/createList', (req, res) => {
  res.render('createList');
});

//UPDATE LIST
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
      PersonalList.findOne({name:req.body.list, author: req.user._id}, (err, foundPersonalList) => {
      if(err){
        console.log(err);
      } else if(foundPersonalList){ // If it exists, push the new item into the items array
        console.log('PUTTING')
        PersonalList.findOneAndUpdate({name:req.body.list, author: req.user._id}, {$push: {items:req.body.item}}, (err, item) => {
          if(err){
            console.log(err);
          }
        });
      } else { // If it doesn't exist, create a new list and push the item in the items array.
      console.log('NOT PUTTING');
        PersonalList.create({
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

//UPDATE ITEMS ON A LIST
router.put('/itemchange', (req, res) => {
  console.log(req.body.item);
  console.log(req.body.oldItem);
  const newItem = req.body.item;
  const oldItem = req.body.oldItem;
  
  PersonalList.findOneAndUpdate({author: req.user.id, items: oldItem}, {$push: {items: newItem}}, (err, updatedList) => {
    if(err){
      console.log(err);
    } else {
      PersonalList.findOneAndUpdate({author: req.user.id, items: oldItem}, {$pull: {items: oldItem}}, (err, updatedList) => {
        if(err){
          console.log(err);
        } else {
          res.redirect('/');
        }
      });
    }
  });  
});


//REMOVE ITEMS USING PUT ROUTE
router.put('/itemremove', (req, res) => {
  console.log(req.body.item);
  console.log(req.user.id);
  PersonalList.findOneAndUpdate({author: req.user.id, items: req.body.item}, {$pull: {items: req.body.item}}, (err, updatedList) => {
    if(err){
      console.log(err);
    } else {
      res.redirect('/');
    }
  }); 
});

//REMOVE PERSONAL LISTS DELETE ROUTE
router.delete('/list', (req, res) => {
  PersonalList.findOneAndDelete({author: req.user.id, name: req.body.name}, (err, deletedList) => {
    if(err){
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;