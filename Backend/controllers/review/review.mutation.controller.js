const { PrismaClient } = require("@prisma/client");
const { StatusCodes } = require("http-status-codes");

const prisma = new PrismaClient();

const addReview = async (req, res) => {
  try {
    const { product_id, review, rating } = req.body;
    const user_id = req.userId;

    const product = await prisma.product.findUnique({
      where: {
        id: product_id,
      },
    });
    if (!product) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Product not found" });
    }
    const reviewed = await prisma.review.create({
      data: {
        review: review,
        rating: rating,
        user_id: user_id,
        product_id: product_id,
      },
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Review added successfully", reviewed });
  } catch (error) {
    console.error("Error adding review:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while adding the review" });
  }
};

const updateReview = async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const { review, rating } = req.body;
    const reviewFetched = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });
    if (!reviewFetched) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Review not found" });
    }
    if (reviewFetched.user_id !== req.userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "You are unauthorized" });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        review: review,
        rating: rating,
      },
    });

    res.json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while updating the review" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const reviewFetched = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });
    if (!reviewFetched) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Review not found" });
    }
    if (reviewFetched.user_id !== req.userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "You are unauthorized" });
    }

    const deletedReview = await prisma.review.delete({
      where: { id: reviewId },
    });

    res.json({ message: "Review deleted successfully", deletedReview });
  } catch (error) {
    console.error("Error deleting review:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while deleting the review" });
  }
};

module.exports = { addReview, updateReview, deleteReview };
