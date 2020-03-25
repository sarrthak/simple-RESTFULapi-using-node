const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/user");

//handling get requests
router.get("/", (req, res, next) => {
  User.find()
    .exec()
    .then(docs => {
      console.log("all users fetched");
      res.status(200).json({ users: docs });
    })
    .catch();
});

//handling post requests
router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: err });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                  user: result,
                  request: {
                    type: "GET",
                    description: "to get all users",
                    url: "http://localhost:3000/users/"
                  }
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
              });
          }
        });
      }
    });
});

//delete users
router.delete("/:userid", (req, res, next) => {
  User.remove({ _id: req.params.userid })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted",
        request: {
          type: "GET",
          description: "return to all users",
          url: "http://localhost:3000/users/"
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
