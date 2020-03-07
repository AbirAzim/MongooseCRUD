const Product = require('../models/product');


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
        .catch(err => console.log(err));
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
            if (product.userId.toString() !== req.user._id.toString()) {
                console.log('not edited :' + product);
                return product.save();
            }
            product.productName = updatedProductName;
            product.productPrice = updatedProductPrice;
            product.imageUrl = updatedImageUrl;
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
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));

}


exports.deleteData = (req, res, next) => {

    prodId = req.params.productId;
    //Product.findByIdAndRemove(req.params.productId)
    Product.deleteOne({ _id: prodId, userId: req.user._id })
        .then(() => {
            Product.find({ userId: req.user._id })
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