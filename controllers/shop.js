const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const PDFDoc = require('pdfkit');


exports.getHomePage = (req, res, next) => {
    //console.log(adminData.data);

    res.render('homePage/shop.ejs', {
        pageTitle: 'Home',
        path: 'homePage/shop.ejs',
        isAuthenticated: req.session.isLoggedIn
    });
}

const ITEM_PER_PAGE = 1;


exports.getProductsPage = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    let totalItems;
    Product.find()
        // .countDocuments()
        // .then(numberOfProducts => {
        //     totalItems = numberOfProducts;
        //     return Product.find() // mongoose method
        //         .skip((page - 1) * ITEM_PER_PAGE)
        //         .limit(ITEM_PER_PAGE)
        // })
        .then(products =>
            res.render('shop/product-list', {
                datas: products,
                pageTitle: 'Product-List',
                path: 'users/products',
                isAuthenticated: req.session.isLoggedIn,
                // currentPage: page,
                // hasNextPage: (ITEM_PER_PAGE * page) < totalItems,
                // hasPreviousPage: page > 1,
                // nextPage: page + 1,
                // previousPage: page - 1,
                // lastPage: Math.ceil(totalItems / ITEM_PER_PAGE)
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
                isAuthenticated: req.session.isLoggedIn
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
            console.log(user.cart.items);
            res.render('shop/cart', {
                path: 'user/cart',
                pageTitle: 'Cart',
                productItem: user.cart.items,
                isAuthenticated: req.session.isLoggedIn
            })
        })
}


exports.deleteFromCart = (req, res, next) => {
    const id = req.body.productId;
    req.user.deleteItemFromCart(id)
        .then(result => res.redirect('/cart'))
        .catch(err => console.log(err))

}

exports.getCheckout = (req, res, next) => {

    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            products = user.cart.items;
            let total = 0;

            products.forEach(p => {
                total += p.quantity * p.productId.productPrice;
            })

            res.render('shop/checkOut', {
                pageTitle: 'Checkout',
                path: 'users/checkout',
                isAuthenticated: req.session.isLoggedIn,
                productItem: products,
                totalSum: total
            })
        })
        .catch(err => {
            return next(err);
        })

}

exports.postOrder = (req, res, next) => {
    const stripe = require('stripe')('sk_test_kXXj8keqTfSiq3Ql1wS3QSn3003qA6Pr9n')
    const token = req.body.stripeToken;
    let totalSum = 0;


    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            user.cart.items.forEach((p) => {
                totalSum += p.quantity * p.productId.productPrice;
            })

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
        .then((result) => {
            const charge = stripe.charges.create({
                amount: totalSum * 100,
                currency: 'usd',
                description: 'Example charge',
                source: token,
                metadata: { oderId: result._id.toString() }
            })

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
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => console.log(err));
}


exports.getInvoice = (req, res, next) => {

    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order Found'))
            }

            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('User Dont Match !'));
            }

            const invoiceName = 'invoice-' + orderId + '.pdf';
            const invoicePath = path.join('data', 'invoice', invoiceName);


            const pdfDoc = new PDFDoc();
            res.setHeader('Content-type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"'); //attachment
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);
            pdfDoc.fontSize('12');
            pdfDoc.fontSize('20').text('Your Order', {
                width: 410,
                align: 'center',
                underline: true
            });
            let totalPrice = 0;
            let count = 0;
            order.products.forEach(prod => {
                totalPrice += prod.product.productPrice * prod.quantity;
                count += 1;
                if (count > 1) {
                    pdfDoc.text('-----------------------------------------');
                }
                pdfDoc.fontSize(13).text('Product Name     : ' + prod.product.productName);
                pdfDoc.fontSize(13).text('Product Quantity : ' + prod.quantity);
                pdfDoc.fontSize(13).text('Product Price     : ' + prod.product.productPrice);
                pdfDoc.fontSize(13).text('Description        : ' + prod.product.description);
            })
            pdfDoc.text('------------------------------------------------------------------------------');
            pdfDoc.fontSize(18).text('Total Price      : ' + totalPrice);
            pdfDoc.end();

            // fs.readFile(invoicePath, (err, data) => {
            //     if (err) {
            //         return next(err);
            //     }
            //     res.setHeader('Content-type', 'application/pdf');
            //     res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"'); //attachment
            //     res.send(data);
            // });

            // const file = fs.createReadStream(invoicePath);

            // file.pipe(res);

        })
        .catch(err => {
            console.log(8);
            return next(err);
        })

}


// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkOut')
// }