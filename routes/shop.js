const express = require('express');
const shopHandeller = require('../controllers/shop');

const router = express.Router();

router.get('/', shopHandeller.getHomePage);

router.get('/users/products', shopHandeller.getProductsPage);

router.get('/product-details/:productId', shopHandeller.getProductDetails);

router.post('/cart', shopHandeller.postCart);

router.get('/cart', shopHandeller.getCart);

// // router.get('/checkout', shopHandeller.getCheckout);

router.post('/cart-delete-item', shopHandeller.deleteFromCart);

router.get('/order', shopHandeller.getOrder);

router.post('/create-order', shopHandeller.postOrder);

module.exports = router;