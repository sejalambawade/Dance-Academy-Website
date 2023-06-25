if(process.env.NODE_ENV !=="production"){
   require('dotenv').config()
}


const cloudname=process.env.cloudname
const API=process.env.APIcloudinary
const secret=process.env.secretcloudinary
const express = require('express');
const app= express();
const path= require('path');
const ejsMate= require('ejs-mate');
const joi= require('joi');
const Learner = require('./models/learnerSchema');
const methodOverride= require('method-override');
const mongoose= require('mongoose');
const flash= require('connect-flash');
const session= require('express-session');
const LearnerRoutes= require('./routes/student');
const passport= require('passport');
const localStrategy= require('passport-local');
const schedule = require('node-schedule');


const del = require('./routes/delete');


mongoose.connect('mongodb://127.0.0.1:27017/d-w', 
{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('strictQuery', false);
const db= mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
   console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
   secret: 'thisshouldbeabettersecret',
   resave: false,
   saveUninitialized: true,
   cookie: {
      httpOnly: true,  //for more security
      expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
   }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); //always remember passport.session in written after app.use(session()).
passport.use(new localStrategy(Learner.authenticate()));

passport.serializeUser(Learner.serializeUser());
passport.deserializeUser(Learner.deserializeUser()); //this 2 statements are for adding and removing user from session.

app.use((req,res,next) => {
   console.log(req.session);
   res.locals.currentUser = req.user;
   res.locals.success=req.flash('success');
   res.locals.error= req.flash('error');
   next();
})

app.use('/', LearnerRoutes);



  const http = require('http').createServer(app);
  const PORT = process.env.port || 3000
  http.listen(PORT, () => {
     console.log(`App is listening on port ${PORT}`)
   })
   
const io = require('socket.io')(http)
   
io.on('connection', (socket) => {
     console.log('socket connected....')
     socket.on('message',(msg)=>{
      socket.broadcast.emit('message',msg)
     })
});


    
 schedule.scheduleJob(" * 16 * * * ", async () => {
      // await reminderMail();    
      // await registrationMail(); 
      await del();
   });