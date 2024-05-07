const { PrismaClient } = require('@prisma/client');
const { StatusCodes } = require('http-status-codes');
const { sendEmail } = require("../../services/email.services");
const { verify_order_boilerplate } = require("../boilerplates.data");
const prisma = new PrismaClient();
const { ORDER_STATUS } = require('../../constants/order.constants');

const createOrder = async (req, res) => {
    const user_id = req.userId;
    let { delivery_address, delivery_contact, cartItems } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            id: user_id
        }
    });
    if (!delivery_contact) {
        delivery_contact = user.contact;
    }
    if (!delivery_address) {
        delivery_address = user.address;
    }
    if (cartItems.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "No items in cart" });
    }


    let total_amount = 0;
    let orderItems = [];

    console.log(cartItems);

    for (let cartItem of cartItems) {
        const category = await prisma.category.findUnique({
            where: {
                id: cartItem.product.category_id
            }
        });
        let discountPer = 0;
        if (category) {
            discountPer = category.discount;
        }
        total_amount += ((cartItem.product.product_price - (cartItem.product.product_price*(discountPer/100))) * cartItem.quantity);
        let cartProduct = await prisma.product.findUnique({ 
            where: { id: cartItem.product_id }
        });
        if (!cartProduct) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Product not found", product_id: cartItem.product_id });
        }
        orderItems.push({
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            price: cartItem.product.price
        });
    }

    const order = await prisma.order.create({
        data: {
            total_amount,
            delivery_address,
            delivery_contact,
            user_id,
            order_status: ORDER_STATUS.PENDING,
            OTP: `${Math.floor(100000 + Math.random() * 100000)}`
        }
    });
    await sendEmail(user.email, verify_order_boilerplate(order.OTP, user.username), "Verify your order");
    
    orderItems = orderItems.map(orderItem => {
        return {
            ...orderItem,
            order_id: order.id
        };
    });
    await prisma.orderItem.createMany({
        data: orderItems
    });
    for (let cartItem of cartItems) {
        console.log(cartItem);
        await prisma.cartItem.deleteMany({
            where: {
                user_id,
                product_id: cartItem.product_id
            }
        });
    }
    const ordered_items = await prisma.orderItem.findMany({
        where: {
            order_id: order.id
        },
        include: {
            product: true
        }
    });
    order.orderItems = ordered_items;
    return res.status(StatusCodes.CREATED).json({ order });
};

const verifyOrderOTP = async (req, res) => {
    try {
        const order_id = parseInt(req.params.orderID);
        let { OTP } = req.body;
        OTP = OTP?.trim();
        if (!OTP || OTP.length !== 6) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid OTP" });
        }
        const order = await prisma.order.findUnique({
            where: {
                id: order_id
            }
        });
        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Order not found" });
        }
        if (order.OTP.trim() === "") {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "OTP already verified" });
        }
        if (order.OTP !== OTP) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "OTP authentication failure" });
        }
        await prisma.order.update({
            where: {
                id: order_id
            },
            data: {
                OTP: ""
            }
        });
        return res.status(StatusCodes.OK).json({ message: "Order verified." });
        
    } catch (error) {
        console.log(error);
    }
}

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
    verifyOrderOTP
}