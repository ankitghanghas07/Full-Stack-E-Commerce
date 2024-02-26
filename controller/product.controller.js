const Product = require("../models/product.model");

async function getProducts(req, res, next){
    try{
        const products = await Product.findAllProducts();
        res.render('customer/products/all-products', {products : products} );
    }catch(error){
        return next(error);
    }
}

async function getProductDetails(req, res, next){
    try{
        const product = await Product.findProductWithId(req.params.id);
        res.render('customer/products/product-details', {product : product});
    }
    catch(error){
        return next(error);
    }
}

module.exports = {
    getProducts : getProducts,
    getProductDetails : getProductDetails
};