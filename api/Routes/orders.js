const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Order = require("../models/order");
const Product = require("../models/product"); 

router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then(docs => {
      if (docs) {
        const orders = {
          count: docs.length,
          order: docs.map(doc => {
            return {
              product: doc.product,
              orderid: doc._id,
              quantity: doc.quantity,
              request: {
                type: "GET",
                url: "http://localhost:3000/orders/" + doc._id
              }
            };
          })
        };
        res.status(200).json({ orders });
      } else {
        const message = {
          decription: "No order list found!"
        };
        console.log(message);
        res.status(404).json({ message });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//for post request
router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        productId: req.body.product,
        quantity: req.body.quantity
      });
      return order
        .save()
        .then(result => {
          console.log(result);
          res.status(201).json({
            message: "new order was created",
            createdOrder: {
              _id: result._id,
              product: result.product,
              quantity: result.quantity,
              request: {
                type: "GET",
                url: "http://localhost:3000/orders/" + result._id
              }
            }
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            message: "could not create a new product, check for errors",
            error: err
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "Product not found",
        error: err
      });
    });
});

//for product ids
router.get("/:orderid", (req, res, next) => {
  const id = req.params.orderid;
  Order.find({ _id: id })
    .select("product quantity _id")
    .populate("product")
    .exec()
    .then(doc => {
      if (doc) {
        const order = doc.map(result => {
          return {
            orderid: result._id,
            product: result.product,
            quantity: result.quantity,
            request: {
              type: "GET",
              description: "return to all orders",
              url: "http://localhost:3000/orders/"
            }
          };
        });
        console.log(order);
        res.status(200).json(order);
      } else {
        const message = {
          body: "No such document found",
          request: {
            type: "GET",
            description: "return to all orders",
            url: "http://localhost:3000/orders/"
          }
        };
        console.log(message);
        res.status(404).json({ message });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//for patch request
router.patch("/:orderid", (req, res, next) => {
  if (req.params.orderid === "special") {
    res.status(403).json({
      message: "you cannot change special",
      orderid: req.params.orderid
    });
  } else {
    res.status(200).json({
      message: "updated successfully",
      orderid: req.params.orderid
    });
  }
});

//for delete request
router.delete("/:orderid", (req, res, next) => {
  Order.remove({ _id: req.params.orderid })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "GET",
          description: "return to all orders",
          url: "http://localhost:3000/orders/"
        }
      });
    });
});

//exporting modules
module.exports = router;
