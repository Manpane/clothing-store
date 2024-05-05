const { PrismaClient } = require("@prisma/client");
const { StatusCodes } = require("http-status-codes");

const prisma = new PrismaClient();
async function createWishlistItem(req, res) {

  const { product_id:productId } = req.body; 
  const userId = req.userId; 
  try {
      const alreadyWishlisted = await prisma.wishlistItem.findFirst({
          where: {
              user_id: userId,
              product_id: productId
          }
      });
      if (alreadyWishlisted) {
          return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Product already wishlisted' });
      }
      const wishlistItem = await prisma.wishlistItem.create({
          data: {
              user_id: userId,
              product_id: productId
          }
      });
      res.status(StatusCodes.CREATED).json({wishlistItem});
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Unable to add product to wishlist" });
  }
}

const getWishlistItemById = async (req, res) => {
  const wishlistItemId = parseInt(req.params.id);

  try {
    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        id: wishlistItemId,
      },
      include: {
        user: true,
      },
    });

    if (!wishlistItem) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Wishlist item not found" });
    }

    res.json(wishlistItem);
  } catch (error) {
    console.error("Error fetching wishlist item:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deleteWishlistItem = async (req, res) => {
  const wishlistItemId = parseInt(req.params.id);
  const wishlistFetched = await prisma.wishlistItem.findUnique({
    where: {
      id: wishlistItemId,
    },
  });
  if (!wishlistFetched) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Item not found" });
  }
  if (wishlistFetched.user_id !== req.userId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "You are unauthorized" });
  }

  try {
    const deletedWishlistItem = await prisma.wishlistItem.delete({
      where: {
        id: wishlistItemId,
      },
    });
    res.json({ message: "Deleted", deletedWishlistItem });
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getWishlistItems = async (req, res) => {
  const userId = req.userId;
  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: {
        user_id: userId,
      },
      include: {
        product: true,
      },
    });
    res.json({wishlistItems});
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

module.exports = {
  createWishlistItem,
  getWishlistItemById,
  deleteWishlistItem,
  getWishlistItems
};
