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
const designtemplete = require("./designtemplete.routes");
const bestService = require("./bestservice.routes");

const vedio = require("./video.routes");
const authVerify = require("../middlewares/authverify");
//---------------------//
router.use("/image", imageRoute);
router.use("/auth", auth);
router.use("/address", authVerify, address);
router.use("/product", product);
router.use("/wishlist", authVerify, like);
router.use("/order", authVerify, order);
router.use("/menu", menuRoute);
router.use("/banners", bannerRoute);
router.use("/video", vedio);
router.use("/design", designtemplete);
router.use("/bestservice", bestService);
module.exports = router;
