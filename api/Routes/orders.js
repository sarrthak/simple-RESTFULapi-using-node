const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const OrdersController = require("../controllers/controller_orders");

//get all products
router.get("/", checkAuth, OrdersController.ordersGetallOders);

//post a new product
router.post("/", checkAuth, OrdersController.ordersCreateOrder);

//for product ids
router.get("/:orderid", checkAuth, OrdersController.orderGetsingleOrder);

//for patch request
router.patch("/:orderid", checkAuth, OrdersController.orderPatch);

//for delete request
router.delete("/:orderid", checkAuth, OrdersController.orderDelete);

//exporting modules
module.exports = router;
