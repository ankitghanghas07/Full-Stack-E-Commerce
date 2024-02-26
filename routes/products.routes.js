const express = require('express');
const productController = require('../controller/product.controller');

const router = express.Router();

router.get('/products', productController.getProducts);

router.get('/products/:id', productController.getProductDetails);

module.exports = router;