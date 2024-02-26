const Cart = require('../models/cart.model');

function initializeCart(req, res, next){
    let cart;
    if(!req.session.cart){
        cart = new Cart();
    }
    else{
        const sessionCart = req.session.cart;
        cart = new Cart(sessionCart.items, sessionCart.totalQuantity, sessionCart.totalPrice);
    }   

    cart.items = cart.items.filter((item) => {
        return item.quantity > 0;
    });

    res.locals.cart = cart;

    next();
}

module.exports =  initializeCart;