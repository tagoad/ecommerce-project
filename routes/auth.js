
const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.get('/', authController.getLogin)

router.get('/register', authController.getRegister)

router.post('/login', authController.postLogin)

router.post('/newUser', authController.postRegister)

router.get('/logout', authController.postLogout)

module.exports = router;