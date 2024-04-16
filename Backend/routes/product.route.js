const router = require("express").Router();

const {
  addProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  addProductImage,
} = require("../controllers/products/product.mutation.controller");

const {
  verifyToken,
  verifyAdmin,
  emailVerified,
} = require("../middleware/auth.middleware");
const {
  getProducts,
  getProduct,
} = require("../controllers/products/product.query.controller");

router
  .route("/product")
  .post(
    verifyToken,
    emailVerified,
    verifyAdmin,
    addProduct,
  )
  .get(getProducts);

  router
  .route("/product/:id")
  .get(getProduct)
  .put(verifyToken, emailVerified, verifyAdmin, updateProduct)
  .delete(verifyToken, emailVerified, verifyAdmin, deleteProduct);

  router.delete(
    "/product/image/:id",
    verifyToken,
    emailVerified,
    verifyAdmin,
    deleteProductImage,
  );

  router.put(
    "/product/image/add",
    verifyToken,
    emailVerified,
    verifyAdmin,
    addProductImage,
  );
  
module.exports = router;
