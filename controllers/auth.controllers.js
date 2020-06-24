const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerValidation, loginValidation }  = require('../validation');

// user register controller
exports.user_register = async (req, res) => {
    //validate
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if the user is already registered
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send("Sorry, the email already exists");

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    });

    try{
        await user.save();
        res.send({user: user._id});
    }catch(err){
        res.status(400).send(err);
    }
};

// user login controller
exports.user_login = async (req, res) => {
    // validate
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).json({success:false, message:error.details[0].message});

    //checking if the email exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).json({success:false, message:"Email is not found in our database."});

    // check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).json({success:false, message:"Password is invalid"});

    // create and assign a token
    const payload = {
        name: user.name,
        email: user.email,
        userId: user._id
    }
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn:"1h"});
    res.header('token', token).status(200).json({success: true, token: token, user: payload});

};