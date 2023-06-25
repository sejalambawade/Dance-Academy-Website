const express = require('express');
const router = express.Router();
const Learner = require('../models/learnerSchema');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const { cloudinary } = require('../cloudinary/index');
const upload = multer({ storage });


getdate = (days) => {
  const requiredDate = new Date();
  requiredDate.setDate(requiredDate.getDate() + days);
  return requiredDate.toLocaleDateString();
}

router.get('/login',(req,res) =>{
    res.render('pages/login.ejs');
   });

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/' }),(req, res) => {
   
    const redirectUrl = req.session.returnTo || '/homepage';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
 })
 
 router.get('/logout',function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success', "Goodbye!");
    res.redirect('/home');
  });
});

 router.post('/home',(req, res, next)=> {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success', "Goodbye!");
    res.redirect('/');
  });
});

 router.get('/register',(req,res) =>{
  res.render('pages/register.ejs');
 });

 router.post('/register', async (req, res) => {
  try {
      const { email, username,slot,danceForm,day,Gender,password } = req.body;
      const regDate=new Date().toLocaleTimeString();
      const user = new Learner({ email, username, slot, danceForm, day, Gender,regDate});
      const registeredUser = await Learner.register(user, password);
      req.login(registeredUser, err => {
          if (err); 
          res.redirect('home');
      })
  } catch (e) {
    console.log(e);
      res.redirect('register');
  }
});

router.get('/profile', isLoggedIn, async(req, res) => {
  const userId = req.user;
  console.log(userId);
  const user = await Learner.findById(userId);
  res.render('pages/profile', { user});
});

router.get('/showevents', isLoggedIn, async(req, res) => {

  const userId = req.user;
  const user = await Learner.findById(userId);
  u=await Learner.find({});
  u.sort( function sp (a,b){
    if(a.sortParse > b.sortParse){
      return -1;
    }
    else if(a.sortParse < b.sortParse){
      return 1;
    }
    else{
      return 0;
    }
  })
  res.render('pages/showevents', { user });
});

router.get('/showevents/:id', isLoggedIn,async(req,res)=>{
  const { id } = req.params;
  console.log(id);
  const userId = req.user;
  const user = await Learner.findById(userId);
 for( let i of user.Events)
    {
      const eventid=i._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
      if(eventid==id){
        console.log(eventid==id);
       res.render('pages/viewevent.ejs',{ i });
    }
  }

});

router.get('/showevents/:id/edit', isLoggedIn,async(req,res)=>{
  const { id } = req.params;
  const userId = req.user;
  const user = await Learner.findById(userId);
 for( let i of user.Events)
    {
      const eventid=i._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
      if(eventid==id){
        console.log(eventid==id);
       res.render('pages/edit.ejs',{ i });
    }
  console.log(id);
  }

});

router.put('/showevents/:id',isLoggedIn,async(req,res)=>{
  const { id } = req.params;
  const { deadline,eventname ,eventdetails} = req.body;
  const dateIssued =new Date();
  const userId = req.user._id;
  const user=req.user;
  const sortParse=Date.parse(deadline);
  await Learner.findByIdAndUpdate(userId, {$pull:{ Events: {_id:id} }});
  const learner = await Learner.findByIdAndUpdate(userId, {$push:{ Events: {deadline,dateIssued,eventname,eventdetails,sortParse}}});
  res.redirect('/showevents');
})

router.delete('/showevents/:id', async(req,res)=>{
  const { id } = req.params;
  const userId = req.user;
  console.log(id);
 await Learner.findByIdAndUpdate(userId, {$pull:{ Events: {_id:id} }});
  res.redirect('/showevents');
});

router.get('/addevent',(req,res)=>{
  res.render('pages/addevent.ejs');
});

router.post('/addevent',isLoggedIn, async(req, res) => {
  const { deadline,eventname ,eventdetails} = req.body;
  const dateIssued =new Date();
  const userId = req.user._id;
  const user=req.user;
  const sortParse=Date.parse(deadline);
  const learner = await Learner.findByIdAndUpdate(userId, {$push:{ Events: {deadline,dateIssued,eventname,eventdetails,sortParse}}});
  res.redirect('/showevents');
});

router.get('/addmemories',isLoggedIn, async(req, res) => {
  res.render('pages/addmemories.ejs');

});

router.post('/addmemories',isLoggedIn,upload.array('image'),async(req,res)=>{
  console.log(req.body,req.files);
  const images = req.files.map( f=> ({ path:f.path, filename:f.filename }));
  const { eventdate,eventname ,eventdetails} = req.body;
  const userId = req.user._id;
  const user=req.user;
  const learner = await Learner.findByIdAndUpdate(userId, {$push:{ Memories: {eventdate,eventname,eventdetails,images}}});

  res.redirect('/showmemories');

});

router.get('/showmemories',isLoggedIn, async(req, res) => {
  const userId = req.user;
  const user = await Learner.findById(userId);
  
  res.render('pages/showmemories.ejs',{user});

});

router.get('/homepage/:id/chat',async(req,res) =>{
  // res.sendFile('C:/Users/Sejal Ambawade/Desktop/dance/views/pages/index.html');
  const userId = req.user;
  const student = await Learner.findById(userId);
  console.log(student.username);
  res.render('pages/index.ejs',{ student });
 });

router.get('/homepage', isLoggedIn,async(req,res)=>{
  const learnerId = req.user;
  console.log(learnerId);
  const user = await Learner.findById(learnerId);
 
  res.render('pages/home.ejs',{ user });
});

router.get('/events',(req,res)=>{
  res.render('pages/events.ejs');
});


router.get('/home',async(req,res) =>{
  const userId = req.user;
  const user = await Learner.findById(userId);
  res.render('pages/homepage.ejs',{user});
 })
 router.get('/aboutus',(req,res) =>{
    res.render('pages/aboutus.ejs');
   })

router.get('/contact',(req,res)=>{
  res.render('pages/contact.ejs');
});


module.exports = router;