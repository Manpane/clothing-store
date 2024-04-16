const router = require("express").Router();

const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const productRouter = require("./product.route");
const categoryRouter = require("./common.route");

router.use(authRouter);
router.use(productRouter);
router.use(categoryRouter);
router.use(userRouter);

module.exports = router;
