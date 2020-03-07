const crypto = require('crypto'); //using built in crypto libraary for genaration random token for user
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const randomString = require('randomstring');
const nodemailer = require('nodemailer');
const nodemailerMailgunTransport = require('nodemailer-mailgun-transport');


//step 1
const auth = {
    auth: {
        api_key: '889d8014d093da1cc7eb96beece1ef0f-c322068c-da37f278',
        domain: 'sandboxd01d44a727b7430f978fb845b877f9a4.mailgun.org'
    }
}

//step 2
let transporter = nodemailer.createTransport(nodemailerMailgunTransport(auth));

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
                    const mailOptions = { //sending mail creating mailoption
                        from: 'badhonkhanbk007@gmail.com',
                        to: gmail, //enters useer gmailid
                        subject: 'new',
                        html: `<h1>Successfully Registered to Diu Project Hub</h1>  <b>Thanks You !</b>`
                    }
                    let token = randomString.generate();
                    user.token = token;
                    //flag the account as inactive
                    user.active = false;
                    user.save()
                        .then(result => {
                            res.redirect('/login');
                            transporter.sendMail(mailOptions, (err, data) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log('message sent');
                                }
                            })
                        })
                        .catch(err => console.log(err));
                })
        })
        .catch(err => console.log(err));
}


exports.getReset = (req, res, next) => {
    console.log(1);
    res.render('auth/reset.ejs', {
        path: '/Reset-Password',
        pageTitle: 'Reset Password',
        isAuthenticated: req.session.isLoggedIn,
        invalidEmail: req.flash('error')
    })
}


exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }

        const token = buffer.toString('hex');
        User.findOne({ gmail: req.body.gmail })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email');
                    res.redirect('/reset');
                } else {
                    user.resetToken = token;
                    user.resetTokenExpire = Date.now() + 3600000;
                    return user.save();
                }
            })
            .then(result => {


                const mailOptions = { //sending mail creating mailoption
                    from: 'badhonkhanbk007@gmail.com',
                    to: req.body.gmail, //enters useer gmailid
                    subject: 'Reset Password',
                    html: `<h1>You Requested Password Reset</h1>
                        <p><a href='http://localhost:3000/reset/${token}'>Click Here TO Reset</a> </p>  `
                }

                return transporter.sendMail(mailOptions, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('message sent');
                    }
                })
            })
            .then(result => {
                res.redirect('/');
            })
            .catch(err => {
                console.log(err);
            });
    })
}


exports.getNewPassword = (req, res, next) => {

    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpire: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                req.flash('error', 'Your Session is over try again');
                return res.redirect('/reset')
            }
            res.render('auth/new-password.ejs', {
                path: '/Reset-Password',
                pageTitle: 'Reset New Password',
                isAuthenticated: req.session.isLoggedIn,
                invalidEmail: req.flash('error'),
                userId: user._id.toString(),
                passwordToken: token
            })
        })
        .catch(err => console.log(err));

}


exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    let resetUser;

    User.findOne({ resetToken: passwordToken, resetTokenExpire: { $gt: Date.now() }, _id: userId })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpire = undefined;

            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => console.log(err))
}