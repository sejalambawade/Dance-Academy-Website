const { number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const LearnerSchema = new Schema({
    image: {
        type: String,
        default: "",
    },
     username: {
         type: String,
         required: true
    },
     email: {
         type: String,
         required: true
     },
     danceForm: {
        type:String,
        required:true
     },
     day:{
        type:String,
        required:true 
     },
     slot:{
        type:Number,
        required:true,
     },
     Gender:{
        type:String,
        required:true
     },
     Credits:{
      type:Number,
      default:0
     },
     regDate:{
      type: String
     },
     Events: [{
      eventname:{ 
         type: String 
         },
         eventdetails:{ 
            type: String 
            },
      dateIssued: { type: Date },
      deadline: { type: Date }, 
      sortParse:{type :Number}
  }],
  Memories: [{
   eventname:{ 
      type: String 
      },
      eventdetails:{ 
         type: String 
         },
   eventdate: { type: Date },
   images:[
      {
         path:String,
         filename:String
      }
   ]
}],
    })

    LearnerSchema.plugin(passportLocalMongoose); 
    module.exports = mongoose.model('Learner', LearnerSchema);