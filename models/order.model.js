const { ObjectId } = require("mongodb");
const db = require("../data/database");

class Order {
  constructor(cart, userData, date, orderId, status = "pending") {
    this.userData = userData;
    this.productData = cart;
    this.status = status;
    if (date) {
      this.date = new Date(date);
    } else {
      this.date = new Date();
    }
    this.date = this.date.toDateString();
    if(orderId){
      this.id = orderId;
    }
  }

  static transformOrders(orders) {
    return orders.map((order) => {
      return new Order(
        order.productData,
        order.userData,
        order.date,
        order._id.toString(),
        order.status,
      );
    });
  }

  static async findAllForUser(userid) {
    let orders = await db
      .getDb()
      .collection("orders")
      .find({ 'userData._id': new ObjectId(userid) })
      .sort({ _id: -1 })
      .toArray();

    orders = this.transformOrders(orders);
    return orders;
  }

  static async findAllOrders() {
    let orders = await db
      .getDb()
      .collection("orders")
      .find()
      .sort({ _id: -1 })
      .toArray();
    orders = this.transformOrders(orders);
    return orders;
  }

  static async findById(orderid) {
    const orderId = new ObjectId(orderid);
    let order = await db.getDb().collection("orders").findOne({ _id: orderId });
    return new Order(
      order.productData,
      order.userData,
      order.date,
      order._id.toString(),
      order.status,
    );
  }

  save() {
    if (!this.id) {
      // insert
      const orderDocument = {
        userData: this.userData,
        productData: this.productData,
        status: this.status,
        date: this.date,
      };
      return db.getDb().collection("orders").insertOne(orderDocument);
    } else {
      // update
      const orderId = new ObjectId(this.id);
      db.getDb()
        .collection("orders")
        .updateOne({ _id: orderId }, { $set: { status: this.status } });
    }
  }
}

module.exports = Order;
