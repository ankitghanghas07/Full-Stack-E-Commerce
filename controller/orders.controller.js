const Order = require('../models/order.model');
const User = require('../models/user.model');

async function getOrders(req, res){
    const uid = res.locals.uid;
    const orders = await Order.findAllForUser(uid);
    res.render('customer/orders/all-orders', {orders : orders});
}

async function addOrder(req, res, next){
    try{
        const userData = await User.findUserById(res.locals.uid);
        const order = new Order(res.locals.cart, userData);
        await order.save();
    }
    catch(error){
        return next(error);
    }

    req.session.cart = null;
    res.redirect('/orders');
}

module.exports = {
    getOrders : getOrders,
    addOrder : addOrder,
}