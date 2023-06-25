const express = require('express');
const router = express.Router();
const Learner = require('../models/learnerSchema');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');

router.delete('/showevents', async(req, res) => {
   
    // await Learner.findByIdAndDelete(userid);
    // req.flash('success', 'Successfully deleted campground')
    // res.redirect('/showevents');
  });
  module.exports = async() => {
    const nextdate = new Date().toLocaleDateString();
    const learners = await Learner.find().populate('Events');
    for(let l of learners){
        for( let s of l.Events){
            console.log(s);
     if (nextdate === s.deadline)
     { await Learner.findByIdAndDelete(s._id)}
        }
    }
   
        
           
    }
