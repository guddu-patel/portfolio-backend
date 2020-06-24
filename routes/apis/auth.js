const router = require('express').Router();
const authController = require('../../controllers/auth.controllers');

// register
router.post('/register', authController.user_register);

//login
router.post('/login', authController.user_login);

//login
router.post('/login1', (req, res) => {
    res.json({success: true, email: req.body.email});
});

module.exports = router;