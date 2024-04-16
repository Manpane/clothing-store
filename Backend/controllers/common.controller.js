const { PrismaClient } = require("@prisma/client");
const { StatusCodes } = require("http-status-codes");
const prisma = new PrismaClient();
const path = require('path');
const fs = require("fs");

async function createCategory(req, res) {
  try {
    const { category_name, image } = req.body;
    const newCategory = await prisma.category.create({
      data: { category_name, image },
    });
    return res.json(newCategory);
  } catch (error) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Can't create category" });
  }
}

const updateCategoryImage = async (req, res) => {
  try {
    const catId = req.params.id;
    const category = await prisma.category.findUnique({
      where: { id: parseInt(catId) },
    });
    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Category not found" });
    }
    const { image } = req.body;
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(catId) },
      data: { image },
    });
    return res.json({ updatedCategory });
  } catch (error) {
    console.error("Error updating category image:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}

const addDiscountToCategory = async (req, res) => {
  try {
    const catId = req.params.id;
    const category = await prisma.category.findUnique({
      where: { id: parseInt(catId) },
    });
    if (!category) {
      return res.BAD_REQUEST.json({ error: "Category not found" });
    }
    const { discount } = req.body;
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(catId) },
      data: { discount: parseFloat(discount) },
    });
    return res.json({ updatedCategory });
  } catch (error) {
    console.error("Error adding discount to category:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}

async function deleteCategory(req, res) {
  try {
    const catId = req.params.id;
    const category = await prisma.category.findUnique({
      where: { id: parseInt(catId) },
    });
    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Category not found" });
    }
    const deleteCategory = await prisma.category.delete({
      where: { id: parseInt(catId) },
    });
    return res.json({
      message: "Category deleted successfully",
      deleteCategory,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}
async function getAllCategory(req, res) {
  try {
    const categories = await prisma.category.findMany();
    return res.json(categories);
  } catch (error) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Not found" });
  }
}




const getOrderStatues = async (req, res) => {
  return res.status(StatusCodes.OK).json({ ORDER_STATUS });
}

try {
  if (!fs.existsSync(path.resolve(__dirname, "..", 'files'))) {
    fs.mkdirSync(path.resolve(__dirname, "..", 'files'));
  }
} catch (error) {

}

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "No file uploaded" });
    }
    const filename = req.file.filename;
    return res.status(StatusCodes.OK).json({ url: `/files/${filename}` });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
}

const getFile = async (req, res) => {
  try {
    const filename = req.params.filename;

    const filePath = path.resolve(__dirname, "..", 'files', filename);
    if (fs.existsSync(filePath) === false) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "File not found" });
    }
    return res.sendFile(filePath);
  }
  catch (error) {
    console.error("Error getting file:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
}

const getAnalytics = async (adminId) => {
  try {
    const totalOrders = await prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            product: {
              admin_id: adminId
            }
          }
        }
      }
    });
    const pendingOrders = totalOrders.filter(order => order.order_status === ORDER_STATUS.PENDING);
    const totalCompletedOrders = totalOrders.filter(order => (order.order_status === ORDER_STATUS.CONFIRMED) || (order.order_status === ORDER_STATUS.DELIVERED));
    const totalSales = totalCompletedOrders.reduce((acc, order) => acc + order.total_amount, 0);
    const last12Months = Date.now() - 1000 * 60 * 60 * 24 * 30 * 12;
    const last12MonthsOrders = totalOrders.filter(order => order.order_date > last12Months);
    const last12MonthsOrdersGrouped = last12MonthsOrders.reduce((acc, order) => {
      const month = new Date(order.order_date).toLocaleString('default', { month: 'long' });
      if (acc[month]) {
        acc[month]++;
      } else {
        acc[month] = 1;
      }
      return acc;
    }, {});
    return { totalOrders: totalOrders.length, pendingOrders: pendingOrders.length, totalCompletedOrders: totalCompletedOrders.length, totalSales, history: last12MonthsOrdersGrouped };
  } catch (error) {
    return false;
  }
}


const getAdminAnalytics = async (req, res) => {
  const adminId = req.userId;
  const analytics = await getAnalytics(adminId);
  if (!analytics) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error getting analytics" });
  }
  return res.status(StatusCodes.OK).json(analytics);
}

const downloadAnalytics = async (req, res) => {
  try {
    const adminId = req.userId;
    const totalOrders = await prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            product: {
              admin_id: adminId
            }
          }
        }
      }
    });
    const totalSales = totalOrders.reduce((acc, order) => {
      if (order.order_status == ORDER_STATUS.DELIVERED) {
        return acc + order.total_amount
      }
      return 0;
    }, 0);
    let csv = "order_date,total_amount,order_status,payment_method,delivery_address,delivery_contact";
    totalOrders.map(order => {
      const dateString = order.order_date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        second: "numeric"
      }).toString().replaceAll(",", " ");
      csv += `\n${dateString},${order.total_amount},${order.order_status},${order.payment_method},${order.delivery_address},${order.delivery_contact}`;
    })
    csv += `\nTotal Sales,${totalSales},,,,`;
    csv += `\nTotal Orders,${totalOrders.length},,,,`;
    const filename = `${adminId}-analytics.csv`;
    const filePath = path.resolve(__dirname, "..", 'files', filename);
    fs.writeFileSync(filePath, csv);
    return res.status(StatusCodes.OK).json({ url: `/files/${filename}` });
  } catch (error) {
    console.error("Error downloading analytics:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

module.exports = { deleteCategory, addDiscountToCategory, downloadAnalytics, getAdminAnalytics, createCategory, updateCategoryImage, getAllCategory, getOrderStatues, uploadImage, getFile };
