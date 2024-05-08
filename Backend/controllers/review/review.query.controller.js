const { PrismaClient } = require("@prisma/client");
const { StatusCodes } = require("http-status-codes");

const prisma = new PrismaClient();

const getReview = async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(StatusCodes.OK).json(review);
  } catch (error) {
    console.error("Error retrieving review:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while retrieving the review" });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany();
    res.json(reviews);
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while retrieving the reviews" });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const reviews = await prisma.review.findMany({
      where: { product_id: productId },
    });

    res.status(StatusCodes.OK).json(reviews);
  } catch (error) {
    console.error("Error retrieving reviews by product ID:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while retrieving the reviews" });
  }
}

const getProductMyReviews = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const userId = req.userId;
    const reviews = await prisma.review.findMany({
      where: { product_id: productId, user_id: userId},
    });

    res.status(StatusCodes.OK).json(reviews);
  } catch (error) {
    console.error("Error retrieving reviews by product ID:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while retrieving the reviews" });
  }
}

const getReviewsByUserId = async (req, res) => {
  try {
    const userId = req.userId;
    const reviews = await prisma.review.findMany({
      where: { user_id: userId },
    });

    res.status(StatusCodes.OK).json(reviews);
  } catch (error) {
    console.error("Error retrieving reviews by user ID:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while retrieving the reviews" });
  }
};

const getReviewByProductId = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const reviews = await prisma.review.findMany({
      where: { product_id: productId },
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error retrieving reviews by product ID:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while retrieving the reviews" });
  }
};


module.exports = {
  getReview,
  getReviews,
  getReviewsByUserId,
  getReviewByProductId,
  getProductReviews,
  getProductMyReviews
};
