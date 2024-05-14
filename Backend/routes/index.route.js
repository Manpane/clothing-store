const router = require("express").Router();

const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const productRouter = require("./product.route");
const categoryRouter = require("./common.route");
const orderRouter = require("./order.route");
const reviewRouter = require("./review.route");
router.use(authRouter);
router.use(productRouter);
router.use(categoryRouter);
router.use(userRouter);
router.use(orderRouter);
router.use(reviewRouter);

module.exports = router;
