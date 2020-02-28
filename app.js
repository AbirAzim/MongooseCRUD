const express = require('express');
const bodyParser = require('body-parser'); //for rendering req.body
const path = require('path');

const router = require('./routes/admin'); //importing admin.js file
const homePage = require('./routes/shop'); //importing shop.js file
const errorPage = require('./controllers/error');


const User = require('./models/user');

const mongoose = require('mongoose');



const app = express();


app.set('view engine', 'ejs'); // to set ejs as view engine
app.set('views', 'views'); //to set ejs as view engine


app.use(bodyParser.urlencoded({ // for rendering req.body
    extended: false
}));



app.use(express.static(path.join(__dirname, 'public'))); //for stylesheet 

app.use((req, res, next) => {
    User.findById('5e57981f78d16f545c71a2e3')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})

app.use('/admin', router);
app.use(homePage);


app.use(errorPage.errorController)



mongoose.connect('mongodb+srv://badhon:iwilldoit@cluster0-uiuo7.mongodb.net/shop?retryWrites=true&w=majority')
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