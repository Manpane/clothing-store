const { PrismaClient } = require('@prisma/client');
const { StatusCodes } = require('http-status-codes');
const prisma = new PrismaClient();
const { ORDER_STATUS } = require('../../constants/order.constants');
const { initiateKhaltiPayment } = require('../../services/khalti.services');

const createOrder = async (req, res) => {
    const user_id = req.userId;
    let { productid } = req.params;
    const {
        delivery_address,
        delivery_contact,
        return_url,
        website_url,
        quantity
    } = req.body;

    const product = await prisma.product.findUnique({
        where: {
            id: parseInt(productid)
        }
    });

    if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Product not found" });
    }

    const order = await prisma.order.create({
        data: {
            user_id,
            order_status: ORDER_STATUS.PENDING,
            delivery_address,
            delivery_contact,
            OTP: "",
            total_amount: product.product_price*Number(quantity),
        }
    });

    await prisma.orderItem.create({
        data: {
            order_id: order.id,
            product_id: product.id,
            quantity: parseInt(quantity),
        }
    });

    try {
        let pidx, payment_url;
        try {
            const khaltiResponse = await initiateKhaltiPayment({
                return_url,
                website_url,
                amountInRs: product.product_price*quantity,
                purchase_order_id: order.id,
                purchase_order_name: `${product.id}-${product.product_name}`,
            });
            pidx = khaltiResponse.pidx;
            payment_url = khaltiResponse.payment_url;
            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Payment initiated",
                order,
                payment_url,
                pidx
            });
        } catch (error) {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to initiate payment"
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to create order"
        });
    }
};

const updateOrder = async (req, res) => {
    const order_id = req.params.orderID;
    const { order_status } = req.body;
    const order = await prisma.order.update({
        where: {
            id: parseInt(order_id)
        },
        data: {
            order_status
        }
    });
    const ordered_items = await prisma.orderItem.findMany({
        where: {
            order_id: order.id
        }
    });
    order.orderItems = ordered_items;

    return res.status(StatusCodes.OK).json({ order });
}

const cancelOrder = async (req, res) => {
    const order_id = req.params.orderID;
    const user_id = req.userId;
    const order = await prisma.order.findUnique({
        where: {
            id: parseInt(order_id),
        }
    });
    if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Order not found" });
    }
    if (order.user_id !== user_id) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: "You are not authorized to cancel this order" });
    }

    if (order.status !== ORDER_STATUS.PENDING) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Only pending orders can be cancelled" });
    }

    await prisma.orderItem.deleteMany({
        where: {
            order_id
        }
    });
    await prisma.order.update({
        where: {
            id: order_id
        },
        data: {
            status: ORDER_STATUS.CANCELLED
        }
    });
    return res.status(StatusCodes.NO_CONTENT).json();
}


const deleteOrder = async (req, res) => {
    const order_id = req.params.orderID;
    const user_id = req.userId;

    const order = await prisma.order.findUnique({
        where: {
            id: parseInt(order_id)
        }
    });

    if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Order not found" });
    }

    if (order.user_id !== user_id) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: "You are not authorized to delete this order" });
    }

    if (order.status !== ORDER_STATUS.PENDING) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Only pending orders can be deleted" });
    }

    await prisma.orderItem.delete({
        where: {
            order_id
        }
    });
    const deleted = await prisma.order.delete({
        where: {
            id: order_id
        },
    });
    return res.status(StatusCodes.OK).json({ deleted });
}

module.exports = {
    createOrder,
    updateOrder,
    cancelOrder,
    deleteOrder,
}