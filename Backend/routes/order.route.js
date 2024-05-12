const router = require("express").Router();

const { verifyPayment } = require("../controllers/khalti/khalti.controller");

const {
  verifyToken,
  emailVerified,
  verifySuperAdmin,
} = require("../middleware/auth.middleware");

const {
  createOrder,
  updateOrder,
  cancelOrder,
  deleteOrder,
} = require("../controllers/order/order.mutation.controller");

const { getOrders, getAllOrders } = require("../controllers/order/order.query.controller");

router.post("/order/:productid", verifyToken, emailVerified, createOrder);
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
  "/khalti/verify",
  verifyPayment,
);

module.exports = router;