const { sendContactEmail } = require('../services/EmailService');

// works on sending email after user fil up contact form
exports.contact = async (req, res) => {
    const emailSend = await sendContactEmail(req.body);
    return res.send(emailSend)
    return res.json({success:true, message: emailSend});
    // if(emailSend){
    //     return res.json({success: true, message: emailSend});
    // }else{
    //
    // }
}