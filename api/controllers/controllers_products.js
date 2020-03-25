const Product = require("../models/product");
const mongoose = require("mongoose");

//get all products
exports.productsGetAll = (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc.id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
          };
        })
      };
      res.status(200).json({ response });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

//post a new product
exports.productPostNewProduct = (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product
    .save() // we do not use .exec() because .save() works as a real promise and is not a query, therefore it returns .then() and .catch(). When using .find() though, we have to use .exec() because it does not return any error and does not work as a real promise so we have to use .exec()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "handling product POST requests",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id,
            description: "Get all products",
            all_url: "http://localhost:3000/products/"
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

//get a single product
exports.productGetOne = (req, res, next) => {
  const id = req.params.productid;
  Product.findById(id)
    .exec()
    .then(doc => {
      if (doc) {
        console.log(doc);
        res.status(200).json({
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          request: {
            type: "GET",
            description: "Get all products",
            url: "http://localhost:3000/products"
          }
        });
      } else {
        console.log("No document found");
        res.status(404).json({
          error: {
            message: "No document found!!"
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

//patch a new product
exports.productUpdate = (req, res, next) => {
  const id = req.params.productid;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Product updated",
        product: {
          type: "GET",
          description: "Link to updated product",
          url: "http://localhost:3000/products/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

//delete a product
exports.productDelete = (req, res, next) => {
  const id = req.params.productid;
  Product.findByIdAndRemove(id)
    .exec()
    .then(doc => {
      console.log("document removed from the database", doc);
      res
        .status(202)
        .json({ message: "Successfully deleted!", deletedDoc: doc });
    })
    .catch(err => {
      console.log(err);
      res.status(202).json({ error: err });
    });
};
