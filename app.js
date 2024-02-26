// built-in node package
const path = require("path"); 


// third party packages
const express = require("express");
const csrf = require('csurf');
const expressSession = require('express-session');

// // self-defined.
const db = require("./data/database");
const checkAuthStatusMiddleware = require('./middleware/check-auth-status');
const createSessionConfig = require('./config/session-config'); 
const addCsrfTokenMiddleware = require('./middleware/csrf-token');
const protectRoutes = require('./middleware/protect-routes');
const cartMiddleware = require('./middleware/cart');
const cartUpdateMiddleware = require('./middleware/updateCart');
const errorHandlingMiddleware = require('./middleware/error-handler');

// routes
const productRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/orders.routes');

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// app.use('<filter route>', middleware1, middleware2 ... )
app.use(express.static('public')); // express.static is also a middleware.
app.use( '/products/assets', express.static('product-data'));
app.use(express.urlencoded({extended:false})); // this middleware extracts the urlencoded data with incoming request.
app.use(express.json()); // express.json() returns a middleware to extract data from incoming req if req is in form of json

const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(csrf()); // add this before using the route middleware
app.use(addCsrfTokenMiddleware);

app.use(cartMiddleware);
app.use(cartUpdateMiddleware);

app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use('/cart', cartRoutes);
app.use(protectRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);

app.use(errorHandlingMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(console.error);

