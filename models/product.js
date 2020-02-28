// const getDb = require('../util/db').getDb;
// const mogodb = require('mongodb');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const productSchema = new Schema({

    productName: {
        type: String,
        required: true
    },

    productPrice: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    imageUrl: {
        type: String,
        required: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})


module.exports = mongoose.model('Product', productSchema);

// class Product {
//     constructor(productName, productPrice, description, imageUrl, id, userId) {
//         this.productName = productName;
//         this.productPrice = productPrice;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = id ? mogodb.ObjectID(id) : null;
//         this.userId = mogodb.ObjectID(userId);
//     }

//     save() {

//         const db = getDb();
//         let dbOperation;
//         if (this._id) {
//             //upadate its value
//             dbOperation = db.collection('products').updateOne({
//                 _id: this._id
//             }, {
//                 $set: this
//             });
//         } else {
//             dbOperation = db.collection('products').insertOne(this)
//         }

//         return dbOperation
//             .then(result => console.log(result))
//             .catch(err => console.log(err));
//     }

//     static getAllProducts() {
//         const db = getDb();
//         return db.collection('products') //products will return from here
//             .find()
//             .toArray()
//             .then(product => product) //return it to the db.collection
//             .catch(err => console.log(err));

//     }

//     static getProductById(prodId) {

//         const db = getDb();

//         return db.collection('products') // product will return from here
//             .find({
//                 _id: new mogodb.ObjectID(prodId)
//             })
//             .next()
//             .then(product => {
//                 // console.log(product);
//                 return product;
//             })
//             .catch(err => console.log(err))
//     }


//     static deleteProductById(prodId) {

//         const db = getDb();

//         return db.collection('products')
//             .deleteOne({
//                 _id: new mogodb.ObjectID(prodId)
//             })
//             .then(() => console.log('1 item deleted'))
//             .catch(err => console.log(err));
//     }

// }




// module.exports = Product;