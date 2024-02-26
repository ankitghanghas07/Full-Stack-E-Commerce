const express = require('express');
const router = express.Router();

const ordersController = require('../controller/orders.controller');

router.get('/', ordersController.getOrders);

router.post('/', ordersController.addOrder);

module.exports = router;