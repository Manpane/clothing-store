const router = require("express").Router();

const { verifyPayment } = require("../controllers/khalti/khalti.controller");

const {
  verifyToken,
  verifyAdmin,
  emailVerified,
  validationMiddleware,
  verifySuperAdmin,
} = require("../middleware/auth.middleware");

const {
  createOrder,
  updateOrder,
  cancelOrder,
  deleteOrder,
  verifyOrderOTP,
} = require("../controllers/order/order.mutation.controller");

const { getOrders, getAllOrders } = require("../controllers/order/order.query.controller");
const { createOrderSchema } = require("../zod_validation/all.zod.validation");

router.post("/order/verifyOrderOTP/:orderID", verifyToken, emailVerified, verifyOrderOTP);
router.post("/order", verifyToken, emailVerified,  validationMiddleware(createOrderSchema), createOrder);
router.get("/order", verifyToken, emailVerified, getOrders);
router.get("/order/all", verifyToken, verifySuperAdmin, getAllOrders);
router.get("/order/:orderID", verifyToken, emailVerified, getOrders);
router.patch(
  "/order/:orderID",
  verifyToken,
  verifySuperAdmin,
  updateOrder,
);
router.delete(
  "/order/:orderID/cancel",
  verifyToken,
  emailVerified,
  cancelOrder,
);
router.delete("/order/:orderID", verifyToken, emailVerified, deleteOrder);
router.post(
  "/khalti/verify/:orderID",
  verifyToken,
  emailVerified,
  verifyPayment,
);

module.exports = router;