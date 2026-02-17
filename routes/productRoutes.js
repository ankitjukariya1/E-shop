const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    authorize("admin", "seller"),
    upload.single("image"),
    createProduct,
  );

// Seller: get own products (must be before /:id route)
router.get("/seller/my-products", protect, authorize("seller"), getMyProducts);

router
  .route("/:id")
  .get(getProduct)
  .put(
    protect,
    authorize("admin", "seller"),
    upload.single("image"),
    updateProduct,
  )
  .delete(protect, authorize("admin", "seller"), deleteProduct);

module.exports = router;
