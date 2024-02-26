const { ObjectId } = require("mongodb");
const Product = require("../models/product.model");
const Order = require("../models/order.model");

async function getProducts(req, res, next) {
  try {
    const products = await Product.findAllProducts();
    res.render("admin/products/all-products", { products: products });
  } catch (error) {
    return next(error);
  }
}

function getNewProduct(req, res) {
  res.render("admin/products/new-product");
}

async function createNewProduct(req, res) {
  const product = new Product({
    ...req.body,
    image: req.file.filename,
  });

  await product.save();
  res.redirect("/admin/products");
}

async function getUpdateProduct(req, res, next) {
  try {
    const product = await Product.findProductWithId(req.params.id);
    res.render("admin/products/update-product", { product: product });
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  const productData = new Product({
    ...req.body,
    _id: new ObjectId(req.params.id),
  });

  if (req.file) {
    // replace the old image with the new one, this func has to be static in order to access it from here
    productData.updataImage(req.file.filename);
  }

  try {
    await productData.save();
  } catch (error) {
    return next(error);
  }

  res.redirect("/admin/products");
}

async function deleteProduct(req, res, next) {
  try {
    await Product.deleteProduct(req.params.id);
    res.json({ message: "Product Delete." }); // sending data response because we goona call this method using ajax, it will accept some redirect/render. because the purpose of ajax is not to reload the page.
  } catch (error) {
    return next(error);
  }
}

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAllOrders();
    res.render("admin/orders/admin-orders", { orders: orders });
  } catch (error) {
    return next(error);
  }
}

async function updateOrder(req, res, next) {
  const orderid = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderid);
    order.status = newStatus;
    order.save();
    res.json({
      message: "order updated.",
      newStatus: newStatus,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getOrders: getOrders,
  updateOrder: updateOrder,
};
