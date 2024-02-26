const { response } = require("express");
const Product = require("../models/product.model");

function getCart(req, res){
    res.render('customer/cart/cart');
}

async function addItemToCart(req, res, next){
    const cart = res.locals.cart;

    try{
        const product = await Product.findProductWithId(req.body.productId);
        cart.addItem(product);
    }
    catch(error){
        return next(error);
    }

    req.session.cart = cart;

    res.status(201).json({
        message : 'data added successfully.', 
        newTotalQuantity : cart.totalQuantity
    });
}

function updateCartItem(req, res, next){
    const productId = req.body.productId, newQuantity = +req.body.newQuantity;
    const response = res.locals.cart.updateItem(productId, newQuantity);
    
    req.session.cart = res.locals.cart;

    res.status(200).json({
        newTotalPrice : response[0],
        newProductTotal : response[1],
        newTotalQuantity : res.locals.cart.totalQuantity
    });
}

module.exports = {
    getCart : getCart,
    addItemToCart : addItemToCart,
    updateCartItem : updateCartItem,
};