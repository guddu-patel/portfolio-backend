const { sendContactEmail } = require('../services/EmailService');
const { contactValidation } = require('../validation');

// works on sending email after user fil up contact form
exports.contact = async (req, res) => {
    // validate
    const { error } = contactValidation(req.body);
    if (error) return res.status(400).json({success: false, message: error.details[0].message});

    await sendContactEmail(req.body, (error, data) => {
        if(error){
            return res.status(500).json({success: false, message: error});
        }else{
            return res.status(200).json({success: true, message: data});
        }
    });
}