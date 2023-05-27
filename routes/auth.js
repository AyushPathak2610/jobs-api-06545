const express = require('express');
const router = express.Router();

const { login, register } = require('../controllers/auth');

router.post('/login',login);
router.post('/register',register);

// router.route('/login').post(login);
// router.route('/register').post(register);

module.exports = router;