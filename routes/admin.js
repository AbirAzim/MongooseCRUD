const express = require('express');
const path = require('path');

const router = express.Router();
const adminControllers = require('../controllers/admin');
const authenticate = require('../middleware/is-auth');

router.get('/add-product', authenticate, adminControllers.getAddProduct);

router.get('/products', authenticate, adminControllers.getProductList);

router.post('/products', authenticate, adminControllers.postAddProduct);

router.get('/edit-products/:productId', authenticate, adminControllers.getEditProduct);

router.post('/productsEdit', authenticate, adminControllers.postEditData);

router.get('/delete-product/:productId', authenticate, adminControllers.deleteData);


module.exports = router;