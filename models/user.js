const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    gmail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }

        }]
    },
    resetToken: String,
    resetTokenExpire: Date,
    ActivationToken: String,
    ActivationTokenExpire: Date,
    active: Boolean
})

userSchema.methods.addToCart = function(product) {

    const cartProductIndex = this.cart.items.findIndex(cartItem => cartItem.productId.toString() === product._id.toString());
    let newQuantity = 1; // the product we wanna enter into cart first of all check the product id is present in the cart items or not
    //let updatedCartItems = [];
    const updatedCartItems = [...this.cart.items]; //
    //console.log('updated cart Items ' + updatedCartItems);
    //console.log('----------------------------------------------');

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
        //console.log(updatedCartItems);
    } else {
        updatedCartItems.push({
                productId: product._id,
                quantity: newQuantity
            })
            //console.log(updatedCartItems);
    }

    const updatedCart = {
        items: updatedCartItems
    };
    //console.log(updatedCartItems);
    this.cart = updatedCart;
    //console.log(this);

    //console.log(this.cart);
    return this.save();
}

userSchema.methods.deleteItemFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(ci => ci._id.toString() !== productId.toString());
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = {
        items: []
    };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);




// class User {
//     constructor(name, gmail, cart, id) {
//         this.name = name;
//         this.gmail = gmail;
//         this.cart = cart;
//         this._id = id;
//     }

//     save() {
//         const db = getDb();

//         db.collection('user').insertOne(this)
//             .then(result => {
//                 console.log('1 user added!');
//             })
//             .catch(err => console.log(err));
//     }

//     addToCart(product) {

//         const cartProductIndex = this.cart.items.findIndex(cartItem => cartItem.productId.toString() === product._id.toString());
//         let newQuantity = 1; // the product we wanna enter into cart first of all check the product id is present in the cart items or not
//         //let updatedCartItems = [];
//         const updatedCartItems = [...this.cart.items]; //
//         // console.log('updated cart Items ' + updatedCartItems);
//         // console.log('----------------------------------------------');

//         if (cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({
//                 productId: new mongodb.ObjectID(product._id),
//                 quantity: newQuantity
//             })
//         }

//         const updatedCart = {
//             items: updatedCartItems
//         }

//         const db = getDb();
//         return db.collection('user').updateOne({
//             _id: mongodb.ObjectID(this._id)
//         }, {
//             $set: {
//                 cart: updatedCart
//             }
//         });
//     }


//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map(item => item.productId);

//         return db.collection('products').find({
//                 _id: {
//                     $in: productIds
//                 }
//             })
//             .toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {
//                         ...p,
//                         quantity: this.cart.items.find(i => {
//                             return i.productId.toString() === p._id.toString();
//                         }).quantity
//                     }
//                 })
//             })
//     }

//     deleteItemFromCart(id) {
//         const db = getDb();

//         const updatedCartItems = [...this.cart.items].filter(item => item.productId.toString() !== id.toString());
//         return db.collection('user').updateOne({
//             _id: mongodb.ObjectID(this._id)
//         }, {
//             $set: {
//                 cart: {
//                     items: updatedCartItems
//                 }
//             }
//         });
//     }

//     static getAllUsers() {

//         const db = getDb();

//         return db.collection('user')
//             .find()
//             .toArray()
//             .then(users => {
//                 return users;
//             })
//             .catch(err => console.log(err));
//     }


//     static findUserById(userId) {
//         const db = getDb();

//         return db.collection('user')
//             .find({
//                 _id: mongodb.ObjectID(userId)
//             })
//             .next()
//             .then(user => {
//                 // console.log(user);
//                 return user;
//             })
//             .catch(err => err);
//     }


//     addOrder() {
//         const db = getDb();

//         return this.getCart()
//             .then(cartItem => {
//                 const order = {
//                     items: cartItem,
//                     user: {
//                         _id: mongodb.ObjectID(this._id),
//                         name: this.name
//                     }
//                 }
//                 return db.collection('orders').insertOne(order);
//             })
//             .then(result => {
//                 this.cart = {
//                     items: []
//                 };
//                 return db.collection('user').updateOne({
//                     _id: mongodb.ObjectID(this._id)
//                 }, {
//                     $set: {
//                         cart: {
//                             items: []
//                         }
//                     }
//                 });
//             })
//             .catch(err => console.log(err))
//     }


//     getOrder() {
//         const db = getDb();

//         return db.collection('orders').find({
//             'user._id': new mongodb.ObjectID(this._id)
//         }).toArray()
//     }


// }