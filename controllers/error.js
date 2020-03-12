exports.errorController = (req, res, next) => {
    res.status(404).render('error.ejs', {
        pageTitle: 'Not Found',
        path: '404',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.error500 = (req, res, next) => {
    res.status(500).render('500.ejs', {
        pageTitle: 'We are working on it',
        path: '500',
        isAuthenticated: req.session.isLoggedIn
    })
}