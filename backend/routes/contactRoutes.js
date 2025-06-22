const express = require('express');
const { sendContactMessage } = require('../controllers/contactController');

const router = express.Router();

router.post('/', sendContactMessage); // ✅ This is now a valid function

module.exports = router;
