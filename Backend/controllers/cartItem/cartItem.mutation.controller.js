const { PrismaClient } = require("@prisma/client");
const { StatusCodes } = require("http-status-codes");

const prisma = new PrismaClient();

async function createCartItem(req, res) {
  const { quantity, product_id } = req.body;
  const user_id = req.userId;
  try {
    const cartItem = await prisma.cartItem.create({
      data: {
        quantity,
        product_id,
        user_id,
      },
    });
    res.status(StatusCodes.CREATED).json(cartItem);
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Unable to add product to cart" });
  }
}

const getCartItemsByUserId = async (req, res) => {
  const userId = req.userId;

  try {
    const items = await prisma.cartItem.findMany({
      where: {
        user_id: userId,
      },
      include: {
        product: {
          include: {
            category: true,
          }
        },
        
      },
    });

    res.status(StatusCodes.OK).json({cartitems: items});
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateCartItemQuantity = async (req, res) => {
  cartItemId = parseInt(req.params.id);
  const { quantity, product_id } = req.body;
  const user_id = req.userId;
  try {
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: cartItemId,
        user_id
      },
      data: {
        quantity,
        product_id,
      },
    });
    res.status(StatusCodes.OK).json({ updatedCartItem });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deleteCartItem = async (req, res) => {
  const cartItemId = parseInt(req.params.id);
  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        id: cartItemId,
      },
    });
    if (!cartItem) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Cart item not found" });
    }
    if (cartItem.user_id !== req.userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Unauthorized to delete cart item" });
    }
    const deletedCartItem = await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });
    res.json({ message: "Deleted Successfully", deletedCartItem });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

module.exports = {
  getCartItemsByUserId,
  deleteCartItem,
  createCartItem,
  updateCartItemQuantity,
};
