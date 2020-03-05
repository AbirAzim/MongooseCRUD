const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/sign-up', authController.getSignup);

router.post('/sign-up', authController.postSignup);

module.exports = router;