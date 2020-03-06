const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {

    // let isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
    // console.log(isLoggedIn);
    res.render('auth/login.ejs', {
        path: 'user/login',
        pageTitle: 'Log-in',
        isAuthenticated: false,
        invalidEmail: req.flash('error'),
        invalidPassword: req.flash('errorPass')
    })
}


exports.postLogin = (req, res, next) => {

    const gmail = req.body.gmail;
    const password = req.body.password;

    User.findOne({ gmail: gmail })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid Email');
                res.redirect('/login');
            } else {
                bcrypt.compare(password, user.password)
                    .then(doMatch => {
                        if (doMatch) {
                            req.session.user = user;
                            req.session.isLoggedIn = true; // this is added throughmiddlewire 
                            req.session.save(err => {
                                if (err) {
                                    res.redirect('/login');
                                } else res.redirect('/');
                            });
                        } else {
                            req.flash('errorPass', 'Invalid Password');
                            res.redirect('/login');
                        }
                    })
                    .catch(err => {
                        req.flash('errorPass', 'Invalid Password');
                        res.redirect('/login');
                    });
            }
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {

    req.session.destroy((err) => {
        if (!err) {
            console.log(err);
            res.redirect('/');
        }
    })
}

exports.getSignup = (req, res, next) => {

    res.render('auth/signup.ejs', {
        path: 'user/sign-up',
        pageTitle: 'Sign-up',
        isAuthenticated: false,
        alreadyHaveThisEmailError: req.flash('errorAccount')
    })
}


exports.postSignup = (req, res, next) => {
    const gmail = req.body.gmail;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const name = req.body.name;

    User.findOne({ gmail: gmail })
        .then(user => {
            if (user) {
                req.flash('errorAccount', 'Already Have Account With That Email');
                return res.redirect('/sign-up');
            }
            return bcrypt.hash(password, 12)
                .then(hashPass => {
                    const user = new User({
                        name: name,
                        gmail: gmail,
                        password: hashPass,
                        cart: { items: [] }
                    })
                    user.save()
                        .then(result => {
                            res.redirect('/login');
                        })
                        .catch(err => console.log(err));
                })
        })
        .catch(err => console.log(err));
}