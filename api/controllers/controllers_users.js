const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user");

//get all users
exports.userGetAll = (req, res, next) => {
  User.find()
    .exec()
    .then(docs => {
      console.log("all users fetched");
      res.status(200).json({ users: docs });
    })
    .catch();
};

//make a new user
exports.userMakeNew = (req, res, next) => {
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
};

//user logging in
exports.userLogin = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch();
};

//delete a user
exports.userDelete = (req, res, next) => {
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
};
