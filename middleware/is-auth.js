module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) { // if user wanted to illigally access the route
        return res.redirect('/login');
    }
    next();
}