const express = require("express");
const router = express.Router();
const imageRoute = require("./image.routes");
const auth = require("./auth.route");
const address = require("./address.routes");
const product = require("./product.routes");
const like = require("./wishlist.routes");
const order = require("./order.routes");
const menuRoute = require("./menu.routes");
const bannerRoute = require("./banner.routes");

const vedio = require("./video.routes");
//---------------------//
router.use("/image", imageRoute);
router.use("/auth", auth);
router.use("/address", address);
router.use("/product", product);
router.use("/wishlist", like);
router.use("/order", order);
router.use("/menu", menuRoute);
router.use("/banners", bannerRoute);
router.use("/video", vedio);
module.exports = router;
