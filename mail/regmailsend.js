const nodemailer = require('nodemailer');
const reminderRecipients = require('./regmail');

const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: 'ambawadesejal@outlook.com',
        pass: 'seju2826178@'
    }
});

let recipients = [];

module.exports = async() => {
    recipients = await reminderRecipients();
    if ((recipients.length) === 0) {
        console.log("No recipients detected");
    }
    else {
        transporter.sendMail({
            from: 'ambawadesejal@outlook.com',
            to: recipients,
            subject: "Event reminder!",
            html: "<p>Dear Student,<br>This to remind you that the event for which you where preparing from past few days is just one day ahead..Thanks for your hardwork.<br>BEST WISHES FROM DANCEBEAT ACADEMY </p>",
        }, function (err, info) {
            if (err){
                console.log(err);
            }
            else {
            console.log("Sent" + info.response);
            }
        })
    }
}