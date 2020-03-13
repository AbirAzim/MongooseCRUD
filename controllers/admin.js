const Product = require('../models/product');
const mongoose = require('mongoose');
const fileHelper = require('../util/file');


exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product.ejs', {
        pageTitle: 'Add Product',
        path: 'admin/add-product.ejs',
        activeAddProduct: true,
        productCSS: true,
        editig: false,
        isAuthenticated: req.session.isLoggedIn,
        userId: req.user._id.toString()
    });
}

exports.postAddProduct = (req, res, next) => {

    const productName = req.body.productName;
    const productPrice = req.body.productPrice;
    const image = req.file;
    const desc = req.body.description;
    const userId = req.user._id;

    // if(!image){
    //     err
    // }


    const imageUrl = image.path;

    const product = new Product({
        productName: productName,
        productPrice: productPrice,
        description: desc,
        imageUrl: imageUrl,
        userId: userId
    });


    product.save() //save method comming from mongoose
        .then(result => {
            Product.find({ userId: req.body.userId }) //
                .then(products => {
                    res.render('admin/products.ejs', {
                        datas: products,
                        pageTitle: 'Product-List',
                        path: 'admin/product-list.ejs',
                        isAuthenticated: req.session.isLoggedIn
                    })
                })
                .catch(err => console.log(err));
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getProductList = (req, res, next) => { //{ userId: req.user._id }
    Product.find({ userId: req.user._id }) // find() is a mongoose method to retrive all the data from a certain model or schema
        // .select('productName productPrice -_id')
        // .populate('userId', 'name')
        .then(products => {
            console.log(products);
            res.render('admin/products.ejs', {
                datas: products,
                pageTitle: 'Product-List',
                path: 'admin/product-list.ejs',
                isAuthenticated: req.session.isLoggedIn
            })
        }).catch(err => {
            res.redirect('/500');
        });
}

exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId) // mongoose method
        .then(product => {
            res.render('admin/edit-product.ejs', {
                pageTitle: 'Edit Product',
                path: 'admin/edit-product',
                productForEdit: product,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            res.redirect('/500')
        });
}


exports.postEditData = (req, res, next) => {


    const updatedProductName = req.body.productName;
    const updatedProductPrice = req.body.productPrice;
    const updatedImage = req.file;
    const updatedDesc = req.body.description;
    const prodId = req.body.productId;
    const userId = req.user._id;


    Product.findById(prodId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                console.log('not edited :' + product);
                return product.save();
            }
            product.productName = updatedProductName;
            product.productPrice = updatedProductPrice;
            if (updatedImage) { //check whether user inputed the correct format or not;
                fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = updatedImage.path;
            }
            product.description = updatedDesc;
            product.userId = userId;

            console.log('edited :' + product);
            return product.save();
        })
        .then(result => {
            Product.find({ userId: req.user._id })
                .then(products => {
                    res.render('admin/products.ejs', {
                        datas: products,
                        pageTitle: 'Product-List',
                        path: 'admin/product-list.ejs',
                        isAuthenticated: req.session.isLoggedIn
                    })
                })
                .catch(err => {
                    res.redirect('/500')
                });
        })
        .catch(err => {
            res.redirect('/500')
        });

}


exports.deleteData = (req, res, next) => {

    prodId = req.params.productId;

    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return next(new Error('product Not Found'));
            }
            fileHelper.deleteFile(product.imageUrl); // deleto=ing the local file 
            return Product.deleteOne({ _id: prodId, userId: req.user._id })
        })
        .then(() => {
            Product.find({ userId: req.user._id })
                .then(products => {
                    res.status(200).json({ message: 'success !' });
                })
                .catch(err => {
                    res.status(500).json({ message: `${err}` });
                });
        })
        .catch(err => {
            res.status(500).json({ message: `${err}` });
        });
}