const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const ejs = require("ejs");
const path = require('path');
require('dotenv').config();

// email transporter configuration
const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS
    }
}));

// send emil to admin after customer fill up the contact form
const sendContactEmail = async (user, cb) => {
    const {name, email, phone, message} = user;
    ejs.renderFile(path.join(__dirname, "../views/email/pages/contact.ejs"), {
        admin_name: process.env.ADMIN_NAME,
        name: name,
        email: email,
        phone: phone,
        message: message
    }).then(async (result) => {
        await sendEmail(process.env.ADMIN_EMAIL, "Resume Contact", result, (error, data) =>{
            if (error) cb(error, null);
            else{
                sendThanksEmail(user,  (error, data) => {
                    if (error) cb(error, null);
                    else cb(null, data);
                });
            }
        });
    }).catch(err => {
        cb(err, null);
    });
}

// sending thank you email after filling up the contact form.
const sendThanksEmail = async (user, cb) =>{
    ejs.renderFile(path.join(__dirname, "../views/email/pages/thank_you.ejs"), {
        admin_name: process.env.ADMIN_NAME,
        name: user.name,
    }).then(async (result) => {
        await sendEmail(user.email, "Resume Contact", result, (error, data) =>{
            if (error) cb(error, null);
            else cb(null, data);
        });
    }).catch(err => {
        cb(err, null);
    })
}

// works on sending email passing all data
const sendEmail = async (to, subject, html, cb) => {

    const email = {from: `${process.env.ADMIN_NAME} ${process.env.SMTP_EMAIL}`, to, subject, html};

    await transporter.sendMail(email, function(error, info){
        if (error) cb(error, null);
        else cb(null, info.response);
    });
}

module.exports.sendContactEmail = sendContactEmail;