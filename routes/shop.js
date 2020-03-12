const express = require('express');
const shopHandeller = require('../controllers/shop');
const authenticate = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopHandeller.getHomePage);

router.get('/users/products', shopHandeller.getProductsPage);

router.get('/product-details/:productId', shopHandeller.getProductDetails);

router.post('/cart', authenticate, shopHandeller.postCart);

router.get('/cart', authenticate, shopHandeller.getCart);

router.post('/cart-delete-item', authenticate, shopHandeller.deleteFromCart);

router.get('/order', authenticate, shopHandeller.getOrder);

router.post('/create-order', authenticate, shopHandeller.postOrder);

router.get('/orders/:orderId', authenticate, shopHandeller.getInvoice);

module.exports = router;