const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

//controller
const productController = require("../controllers/controllers_products");

const storage = multer.diskStorage({
  destination: function(req, file, callBack) {
    callBack(null, "./uploads/");
  },
  filename: function(req, file, callBack) {
    callBack(
      null,
      new Date().toDateString().replace(/:/g, "-") + file.originalname
    );
  }
});

const fileFilter = (req, file, callBack) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jifif" ||
    file.mimetype === "image/jpg"
  ) {
    callBack(null, true);
  } else {
    console.log("File type not supported");
    callBack(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { size: 1024 * 1024 * 5 },
  fileFilter: fileFilter
});

//get all products
router.get("/", productController.productsGetAll);

//post a new product
//inside .single() we need to specify the field that will hold the image
router.post("/", upload.single("productImage"), checkAuth, productController.productPostNewProduct);

//get a particular product
router.get("/:productid", productController.productGetOne);

//update a product
router.patch("/:productid", checkAuth, productController.productUpdate);

//for delete request
router.delete("/:productid", checkAuth, productController.productDelete);

//exporting modules
module.exports = router;
