async function updateCartPrices(req, res, next){
    const cart = res.locals.cart;

    await cart.updateCartPrices();

    req.session.cart = cart;

    next();
}

module.exports = updateCartPrices;
