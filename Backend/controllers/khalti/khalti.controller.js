const { StatusCodes } = require("http-status-codes");
const { ORDER_STATUS } = require("../../constants/order.constants");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");

const verifyPayment = async (req, res) => {
    const { token, amount } = req.body;
    const orderID = req.params.orderID;

    if (!orderID) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Order ID is required" });
    }
    if (!token || !amount) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Token and amount are required" });
    }

    const data = {
        token,
        amount
    };

    const order = await prisma.order.findUnique({
        where: {
            id: parseInt(orderID)
        }
    });

    if (!order) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Order not found" });
    }
    if (order.OTP.trim().length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Order is not email verified." });
    }

    let config = {
        headers: { 'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}` }
    };
    let response;
    try {
        response = await axios.post("https://khalti.com/api/v2/payment/verify/", data, config);
    } catch (error) {
        response = error?.response;
        console.log(error);
    }
    await prisma.order.update({
        where: {
            id: parseInt(orderID)
        },
        data: {
            order_status: ORDER_STATUS.CONFIRMED
        }
    });
    return res.status(StatusCodes.OK).json({ success: true, message: "Payment verified successfully" });
}

module.exports = {
    verifyPayment
};