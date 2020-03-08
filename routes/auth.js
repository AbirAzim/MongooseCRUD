const express = require('express');
const { check, body } = require('express-validator');
const User = require('../models/user');

const router = express.Router();

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/sign-up', authController.getSignup);

router.post('/sign-up', [check('gmail').isEmail()
    .withMessage('Please Enter valid DIU Email')
    .custom((value, { req }) => {
        return User.findOne({ gmail: value })
            .then(user => {
                if (user) {
                    return Promise.reject('Already Have User With That Email');
                }
            })
    })
    .custom((value) => {
        if (value.slice(-10) !== 'diu.edu.bd') {
            throw new Error('Should Have DIU email to Sign-Up')
        }
        return true;

    }),
    body('password', 'Password Should be at least 8 characters long !').isLength({ min: 8 })
    .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password Have To Match !')
        }
        return true;
    })
], authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

router.get('/confirmation', authController.getConfirmation);

router.post('/confirmation', authController.postConfirmation);

module.exports = router;