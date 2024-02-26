const Product = require("./product.model");

class Cart{
    constructor(items = [], totalQuantity = 0, totalPrice = 0){
        this.items = items;
        this.totalQuantity = totalQuantity;
        this.totalPrice = totalPrice;
    }

    addItem(product){
        this.totalQuantity++;
        this.totalPrice += product.price;

        for(let i = 0; i<this.items.length; i++){
            if(this.items[i].product.id === product.id){
                this.items[i].quantity += 1;
                this.items[i].totalPrice += product.price;
                return;
            }
        }

        this.items.push({
            product : product,
            quantity : 1,
            totalPrice : product.price
        });
    }

    updateItem(productId, newQuantity){
        newQuantity = Math.max(0, newQuantity);
        
        for(const item of this.items){
            if(item.product.id === productId){
                this.totalPrice -= item.totalPrice;
                this.totalQuantity -= item.quantity;

                item.quantity = newQuantity;
                item.totalPrice = (item.product.price * newQuantity);

                this.totalPrice += item.totalPrice;
                this.totalQuantity += item.quantity;
                
                return [this.totalPrice, item.totalPrice];
            }
        }

        return [0,0];
    }

    async updateCartPrices(){
        this.items = this.items.filter(async function(item) {
            const productid = item.product.id;
            const updatedProduct = await Product.findProductWithId(productid);
            if(!updatedProduct)
                return false;
            return true;
        })

        for(const cartItem of this.items){
            const productid = cartItem.product.id;
            this.totalPrice -= cartItem.totalPrice;

            const updatedProduct = await Product.findProductWithId(productid);
            cartItem.product = updatedProduct;
            cartItem.totalPrice = updatedProduct.price * cartItem.quantity;

            this.totalPrice += cartItem.totalPrice;
        }
    }
}

module.exports = Cart