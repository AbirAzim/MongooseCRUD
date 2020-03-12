const express = require('express');
const bodyParser = require('body-parser'); //for rendering req.body
const path = require('path');

const router = require('./routes/admin'); //importing route admin.js file
const homePage = require('./routes/shop'); //importing route shop.js file
const authRoute = require('./routes/auth'); //importing route auth.js file
const errorPage = require('./controllers/error');
const session = require('express-session');
const MogodbSessionStore = require('connect-mongodb-session')(session);
const csrfToken = require('csurf');
const flash = require('connect-flash'); // for invalid something to show to the user
const multer = require('multer');


const User = require('./models/user');

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://badhon:iwilldoit@cluster0-uiuo7.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MogodbSessionStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrfToken();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});


const fileFileterOption = (req, file, cb) => {

    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false);
    }
}

app.set('view engine', 'ejs'); // to set ejs as view engine
app.set('views', 'views'); //to set ejs as view engine


app.use(bodyParser.urlencoded({ // for rendering req.body
    extended: false
}));

app.use(multer({ storage: fileStorage, fileFilter: fileFileterOption }).single('image'));



app.use(express.static(path.join(__dirname, 'public'))); //for stylesheet 
app.use('/images', express.static(path.join(__dirname, 'images'))); //for images

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: null
    },
    store: store
}));

app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            req.session.isLoggedIn = true; // this is added throughmiddlewire 
            next();
        })
        .catch(err => {
            throw new Error(err);
        });
})

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken(); // only available in views 
    next(); // without next the program will stack here 
})

app.use('/admin', router);
app.use(homePage);
app.use(authRoute);

app.get('/500', errorPage.error500);

app.use(errorPage.errorController)

app.use((err, req, res, next) => {
    res.redirect('/500');
})


mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err))