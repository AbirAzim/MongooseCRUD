const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');



exports.getHomePage = (req, res, next) => {
    //console.log(adminData.data);
    res.render('homePage/shop.ejs', {
        pageTitle: 'Home',
        path: 'homePage/shop.ejs',
        isAuthenticated: req.isLoggedIn,
    });
}



exports.getProductsPage = (req, res, next) => {

    Product.find() // mongoose method
        .then(products =>
            res.render('shop/product-list', {
                datas: products,
                pageTitle: 'Product-List',
                path: 'users/products',
                isAuthenticated: req.isLoggedIn
            })
        )
        .catch(err => console.log(err));
}


exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;

    Product.findById(productId)
        .then(product => {
            console.log(product);
            res.render('shop/product-details', {
                data: product,
                pageTitle: 'Details',
                path: 'users/products',
                isAuthenticated: req.isLoggedIn
            })
        })
        .catch(err => console.log(err));
}


exports.postCart = (req, res, next) => {
    const productId = req.body.productId;

    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => res.redirect('/cart'))
        .catch(err => console.log(err));
}


exports.getCart = (req, res, next) => {

    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            res.render('shop/cart', {
                path: 'user/cart',
                pageTitle: 'Cart',
                productItem: user.cart.items,
                isAuthenticated: req.isLoggedIn
            })
        })
}


exports.deleteFromCart = (req, res, next) => {
    const id = req.body.productId;
    req.user.deleteItemFromCart(id)
        .then(result => res.redirect('/cart'))
        .catch(err => console.log(err))

}

exports.postOrder = (req, res, next) => {

    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            console.log(user.cart.items.productId);
            const productData = user.cart.items.map(i => {
                return {
                    quantity: i.quantity,
                    product: {
                        ...i.productId._doc
                    }
                }
            })
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user._id
                },
                products: productData
            });

            return order.save();
        })
        .then(() => {

            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/order');
        })
        .catch(err => console.log(err));

}

exports.getOrder = (req, res, next) => {
    Order.find({
            "user.userId": req.user._id
        })
        .then(orders => {
            res.render('shop/order', {
                path: 'user/order',
                pageTitle: 'Your Orders',
                orders: orders,
                isAuthenticated: req.isLoggedIn
            })
        })
        .catch(err => console.log(err));
}


// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkOut')
// }