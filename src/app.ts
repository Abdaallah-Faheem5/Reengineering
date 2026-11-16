import express = require('express');
import cors = require('cors');
import helmet = require('helmet');
import hpp = require('hpp');
import { apiLimiter } from './middlewares/rateLimit.middlewares';
import { CLIENT_URL } from './config/env.config';
import authRoutes = require("./modules/auth/auth.routes");
import categoryRoutes = require("./modules/category/category.routes");
import productRoutes = require("./modules/product/product.routes");
import cartRoutes = require("./modules/cart/cart.routes");
import wishlistRoutes = require("./modules/wishlist/wishlist.routes");
import orderRoutes = require("./modules/order/order.routes");
import errorHandler = require('./middlewares/error.middlewares');
import notFound = require('./middlewares/notFound.middlewares');
const app = express();



// @ts-expect-error TS(2349): This expression is not callable.
app.use(helmet());

app.use(cors(
  //{
    // origin: CLIENT_URL,
    // methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization']
//}
));
app.use(express.json());
app.use(hpp());
app.use("/api/auth", authRoutes);
app.use('/api/', apiLimiter);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Running..." });
});

// @ts-expect-error TS(2769): No overload matches this call.
app.use(notFound);
// @ts-expect-error TS(2769): No overload matches this call.
app.use(errorHandler);

export = app;
