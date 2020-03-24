const express = require("express");
const app = express();
const productsRouter = require("./api/products");
const ordersRouter = require("./api/orders");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();

//mongoose
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://sarthak:" +
    process.env.MONGO_ATLAS_PW +
    "@node-rest-api-atyxk.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
//logger
app.use(morgan("dev"));

//handle raw data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//cross origin resource sharing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-methods", "PUT, POST, PATCH, GET, DELETE");
    return res.status(200).json({});
  }
  next();
});

//routes to handle requests
app.get("/", (req, res, next) => {
  res.status(200).json({
    body: "To access the API use the following end points",
    product: {
      type: "GET",
      description: "get all products",
      url: "http://localhost:3000/products/"
    },
    orders: {
      type: "GET",
      description: "get all orders",
      url: "http://localhost:3000/orders/"
    }
  });
});
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/uploads",express.static("uploads"))

//error handling
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      description: "Some error has occurred! Please try again",
      message: error.message
    }
  });
});

module.exports = app;
