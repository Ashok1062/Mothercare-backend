const express = require('express');
const router = express.Router();
const { userRegister, userLogin } = require('../controller/userController');

// User registration route
router.post('/register', userRegister);
// User login route
router.post('/login', userLogin);

module.exports = router;