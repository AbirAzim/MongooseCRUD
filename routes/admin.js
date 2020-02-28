const express = require('express');
const path = require('path');

const router = express.Router();
const adminControllers = require('../controllers/admin');


router.get('/add-product', adminControllers.getAddProduct);

router.get('/products', adminControllers.getProductList);

router.post('/products', adminControllers.postAddProduct);

router.get('/edit-products/:productId', adminControllers.getEditProduct);

router.post('/productsEdit', adminControllers.postEditData);

router.get('/delete-product/:productId', adminControllers.deleteData);


module.exports = router;