const express = require('express');
const bodyParser = require('body-parser'); //for rendering req.body
const path = require('path');

const router = require('./routes/admin'); //importing route admin.js file
const homePage = require('./routes/shop'); //importing route shop.js file
const authRoute = require('./routes/auth'); //importing route auth.js file
const errorPage = require('./controllers/error');
const session = require('express-session');
const MogodbSessionStore = require('connect-mongodb-session')(session);


const User = require('./models/user');

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://badhon:iwilldoit@cluster0-uiuo7.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MogodbSessionStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});


app.set('view engine', 'ejs'); // to set ejs as view engine
app.set('views', 'views'); //to set ejs as view engine


app.use(bodyParser.urlencoded({ // for rendering req.body
    extended: false
}));



app.use(express.static(path.join(__dirname, 'public'))); //for stylesheet 

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: null
    },
    store: store
}));

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            req.session.isLoggedIn = true; // this is added throughmiddlewire 
            next();
        })
        .catch(err => console.log(err));
})

app.use('/admin', router);
app.use(homePage);
app.use(authRoute);
app.use(errorPage.errorController)



mongoose.connect(MONGODB_URI)
    .then(result => {

        User.findOne().then(user => {
                if (!user) {
                    const user = new User({
                        name: 'bk',
                        gmail: 'badhonkhanbk007@gmail.com',
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }

                app.listen(3000);
            })
            .catch(err => console.log(err))
    })