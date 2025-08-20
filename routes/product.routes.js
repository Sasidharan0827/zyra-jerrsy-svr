const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.get("/search", productController.searchProducts); //search
router.get("/trending", productController.getTrendingProducts); //trending
router.get("/trending/by-menu", productController.trendingProductsByMenu);
router.post("/", upload.single("image"), productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", upload.single("image"), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/menu/:menuId", productController.getProductsByMenu);
router.get("/submenu/:subMenuId", productController.getProductsBySubMenu);
router.get(
  "/mainpage/:subMenuId",
  productController.getMainpageProductsBySubMenuId
); //mainpage product
module.exports = router;
