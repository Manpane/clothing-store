const router = require("express").Router();
const {
  createCartItem,
  getCartItemsByUserId,
  updateCartItemQuantity,
  deleteCartItem,
} = require("../controllers/cartItem/cartItem.mutation.controller");
const {
  verifyToken,
  emailVerified,
} = require("../middleware/auth.middleware");

router.route("/cartitem").post(verifyToken, emailVerified, createCartItem);
router.get("/cartitem", verifyToken, emailVerified, getCartItemsByUserId);
router
  .route("/cartitem/:id")
  .put(verifyToken, emailVerified, updateCartItemQuantity)
  .delete(verifyToken, emailVerified, deleteCartItem);
module.exports = router;
