const {
    createWishlistItem,
    deleteWishlistItem,
    getWishlistItemById,
    getWishlistItems
  } = require("../controllers/wishLIstItem/wishlistitem.mutation.controller");
  const {
    verifyToken,
    verifyAdmin,
    emailVerified,
  } = require("../middleware/auth.middleware");
  
  const router = require("express").Router();
  
  router
    .route("/wishlistitem")
    .post(verifyToken, emailVerified, createWishlistItem);
  
  router
    .route("/wishlistitem/:id")
    .delete(verifyToken, emailVerified, deleteWishlistItem)
    .get(verifyAdmin, emailVerified, getWishlistItemById);
  
  router.get("/wishlistitems", verifyToken, emailVerified, getWishlistItems)
  
  module.exports = router;
  