const {
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/review/review.mutation.controller");
const {
  getReview,
  getReviews,
  getReviewsByUserId,
  getProductReviews,
  getProductMyReviews,
} = require("../controllers/review/review.query.controller");


const { verifyToken, emailVerified, validationMiddleware } = require("../middleware/auth.middleware");

const router = require("express").Router();

router.route("/review")
  .post(verifyToken, emailVerified, addReview)
  .get(getReviews);
router.get("/product/:id/reviews/", getProductReviews);
router.get("/product/:id/myreviews/",verifyToken, emailVerified,getProductMyReviews);

router.get("/myreviews", verifyToken, emailVerified ,getReviewsByUserId);


router
  .route("/review/:id")
  .delete( verifyToken, emailVerified,deleteReview)
  .get( verifyToken, emailVerified,getReview)
  .put( verifyToken, emailVerified,updateReview);

module.exports = router;
