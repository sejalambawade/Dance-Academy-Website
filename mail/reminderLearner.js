const Learner = require('../models/learnerSchema');

getdate = (days) => {
    const requiredDate = new Date();
    requiredDate.setDate(requiredDate.getDate() + days);
    return requiredDate.toLocaleDateString();
}
module.exports = async() => {
    let recipients = [];
    const nextdate = getdate(1);
    const learners = await Learner.find().populate('Events');
    for (let s of learners){
        if ((s.Events).length !== 0){
            for (let b of s.Events){
                if (nextdate === b.deadline)
                { recipients.push(s.email); }
            }
        }        
    }
    return recipients;
}