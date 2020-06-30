const router = require('express').Router();
const contactController = require('../../controllers/contact.controllers');

// route for contact request
router.post('/email', contactController.contact);

module.exports = router;