exports.errorController = (req, res, next) => {
    res.status(404).render('error.ejs', {
        pageTitle: 'Not Found',
        path: '404'
    })
}