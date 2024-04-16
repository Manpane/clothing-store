const { PrismaClient } = require("@prisma/client");
const { StatusCodes } = require("http-status-codes");

const prisma = new PrismaClient();

const getProducts = async (req, res) => {
    const { category_name, q, minPrice, maxPrice } = req.query;
    const where = {};
  
    if (category_name) {
      where.category = { category_name };
    }
  
    if (q) {
      where.OR = [{ product_name: { contains: q } }];
    }
  
    if (minPrice !== undefined && !isNaN(minPrice)) {
      where.product_price = { gte: parseInt(minPrice) };
    }
  
    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      where.product_price = { ...where.product_price, lte: parseInt(maxPrice) };
    }
  
    try {
      let products = await prisma.product.findMany({
        where
      });
  
      products = await Promise.all(products.map(async (product) => {
        const productImages = await prisma.productImage.findMany({
          where: {
            product_id: product.id,
          },
        });
  
        const category = await prisma.category.findFirst({
          where: {
            id: product.category_id,
          },
        });
  
  
        return {
          ...product,
          images: productImages,
          category,
        };
  
      }));
  
  
      res.json({ products });
    } catch (error) {
      console.error("Error retrieving products:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "An error occurred while retrieving the products",
      });
    }
  };

  const getProduct = async (req, res) => {
    const productId = parseInt(req.params.id);
  
    try {
      const product = await prisma.product.findFirst({
        where: {
          id: productId,
        }
      });
  
      if (!product) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ error: "Product not found" });
      }
      product.category = await prisma.category.findUnique({ where: { id: product.category_id } })
      product.images = await prisma.productImage.findMany({ where: { product_id: product.id } })
      res.json(product);
    } catch (error) {
      console.error("Error retrieving product:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "An error occurred while retrieving the product" });
    }
  };

  module.exports = { getProducts, getProduct };