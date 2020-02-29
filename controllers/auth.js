exports.getLogin = (req, res, next) => {

    // let isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
    // console.log(isLoggedIn);
    console.log(req.session.isLoggedIn);
    res.render('auth/login.ejs', {
        path: 'user/login',
        pageTitle: 'Log-in',
        isAuthenticated: false
    })
}


exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn = true; // this is added throughmiddlewire 
    res.redirect('/')
}