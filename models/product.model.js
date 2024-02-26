const db = require("../data/database");
const { ObjectId } = require("mongodb");

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price; // adding '+' in front of it, convert string to integer.
    this.description = productData.description;
    this.image = productData.image;
    this.updataImageData();
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async findAllProducts() {
    const products = await db.getDb().collection("products").find().toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  static async findProductWithId(id) {
    const product = await db.getDb().collection("products").findOne({ _id: new ObjectId(id) });
    if (!product) {
      const error = new Error("Cannot find product with given id");
      error.code = 404;
      return;
    }
    return new Product(product);
  } 

  static async deleteProduct(productId){
    return db.getDb().collection('products').deleteOne({_id : new ObjectId(productId)});
  }

  updataImage(newImage){
    this.image = newImage;
    this.updataImageData();
  }

  updataImageData(){
    this.imagePath = `product-data/images/${this.image}`;
    this.imageURL = `/products/assets/images/${this.image}`;
  }

  // async func always returns a promise. so where you use this func, make sure to use await
  async save() {
    const product = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };

    if (this.id) { // update the product
      if (!this.image) {
        delete product.image;
      }
      await db.getDb().collection("products").updateOne({ _id: new ObjectId(this.id) }, { $set: product });
    } else {
      await db.getDb().collection("products").insertOne(product);
    }

  }

}

module.exports = Product;
