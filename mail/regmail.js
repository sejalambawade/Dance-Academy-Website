const Learner = require('../models/learnerSchema');

getdate = (mins) => {
    const requiredDate = new Date();
    requiredDate.setDate(requiredDate.getMinutes());
    console.log(requiredDate.toLocaleTimeString());
    return requiredDate.toLocaleTimeString();
}
module.exports = async() => {
    let recipients = [];
    const nextdate = getdate(1);
    const learners = await Learner.find().populate('regDate');
    for (let s of learners){
        if (s.regDate!== 0){        
            console.log(s.regDate);
                if (nextdate === s.regDate)
                { recipients.push(s.email); }           
        }        
    }
    return recipients;
}