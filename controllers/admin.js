const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product.ejs', {
        pageTitle: 'Add Product',
        path: 'admin/add-product.ejs',
        activeAddProduct: true,
        productCSS: true,
        editig: false,
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postAddProduct = (req, res, next) => {

    const productName = req.body.productName;
    const productPrice = req.body.productPrice;
    const imageUrl = req.body.imageUrl;
    const desc = req.body.description;
    const userId = req.user._id;

    const product = new Product({
        productName: productName,
        productPrice: productPrice,
        description: desc,
        imageUrl: imageUrl,
        userId: userId
    });

    product.save() //save method comming from mongoose
        .then(result => {
            Product.find()
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
        .catch(err => console.log(err));
}

exports.getProductList = (req, res, next) => {
    Product.find() // find() is a mongoose method to retrive all the data from a certain model or schema
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
        }).catch(err => console.log(err));
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
        .catch(err => console.log(err));
}


exports.postEditData = (req, res, next) => {

    const updatedProductName = req.body.productName;
    const updatedProductPrice = req.body.productPrice;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const prodId = req.body.productId;
    const userId = req.user._id;


    Product.findById(prodId)
        .then(product => {

            product.productName = updatedProductName;
            product.productPrice = updatedProductPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDesc;
            product.userId = userId;

            return product.save();
        })
        .then(result => {
            Product.find()
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
        .catch(err => console.log(err));

}


exports.deleteData = (req, res, next) => {

    Product.findByIdAndRemove(req.params.productId)
        .then(() => {
            Product.find()
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
        .catch(err => console.log(err));
}