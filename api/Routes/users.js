const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const userControllers = require("../controllers/controllers_users");

//get all users
router.get("/", userControllers.userGetAll);

//post a new user
router.post("/signup", userControllers.userMakeNew);

//user loggin in
router.post("/login", userControllers.userLogin);

//delete a user
router.delete("/:userid", checkAuth, userControllers.userDelete);

module.exports = router;
