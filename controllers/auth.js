const User = require('../models/user');

exports.getLogin = (req, res, next) => {

    // let isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
    // console.log(isLoggedIn);
    res.render('auth/login.ejs', {
        path: 'user/login',
        pageTitle: 'Log-in',
        isAuthenticated: false
    })
}


exports.postLogin = (req, res, next) => {

    User.findById('5e57981f78d16f545c71a2e3')
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true; // this is added throughmiddlewire 
            req.session.save();
            res.redirect('/');
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