const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
require('dotenv').config();

const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS
    }
}));

const sendContactEmail = async (user) => {
    const email = {
        from: `${process.env.ADMIN_NAME} ${process.env.SMTP_EMAIL}`,
        to: user.email,
        subject: 'TEST EMAIL FROM NODE JS',
        html: `<p>Hello <strong>${user.name}</strong>. You've received this email from node js application. This is only for testing purpose.</p>`
    };

    await transporter.sendMail(email, function(error, info){
        if (error) {
            return error;
        } else {
            return info.response;
        }
    });
}

module.exports.sendContactEmail = sendContactEmail;