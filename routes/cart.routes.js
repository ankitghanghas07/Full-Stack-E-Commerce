const express = require('express');
const cartController = require('../controller/cart.controller');

const router = express.Router();

router.get('/', cartController.getCart);

router.post('/items', cartController.addItemToCart);

router.post('/update', cartController.updateCartItem);

module.exports = router;