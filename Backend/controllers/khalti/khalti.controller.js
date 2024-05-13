const { StatusCodes } = require("http-status-codes");
const { ORDER_STATUS } = require("../../constants/order.constants");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");

const verifyPayment = async (req, res) => {
    const {
        purchase_order_id
    } = req.query;
    const order = prisma.order.findUnique({
        where: {
            id: Number(purchase_order_id)
        }
    });
    console.log(purchase_order_id)
    console.log(order);
    if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({
            message: "Order not found"
        });
    }

    const updatedOrder = await prisma.order.update({
        where: {
            id: Number(purchase_order_id)
        },
        data: {
            order_status: ORDER_STATUS.CONFIRMED
        }
    });

    return res.status(StatusCodes.OK).json({
        message: "Payment verified",
        order: updatedOrder
    });

}

module.exports = {
    verifyPayment
};