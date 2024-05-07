const { PrismaClient } = require('@prisma/client');
const { StatusCodes } = require('http-status-codes');

const prisma = new PrismaClient();

const getOrders = async (req, res) => {
    const orderID = req.params.orderID;
    let { status } = req.query;
    status = status?.toUpperCase().trim();
    try {
        
        if (!orderID) {
            const userId = req.userId;
            const user = await prisma.user.findUnique({ where: { id: userId } });
            let orders;
            if (user.role.toLowerCase().trim() === "admin") {
                orders = await prisma.order.findMany({
                    where: status ? { order_status: status } : {},
                    include: {
                        orderItems: {
                            include:{
                                product: true
                            }
                        },
                    }
                });
            }else{
                orders = await prisma.order.findMany({
                    where: { user_id: userId, order_status: status ?? undefined},
                    include: {
                        orderItems: true
                    }
                });
            }
            orders = orders ?? [];
            return res.status(StatusCodes.OK).json({orders});
        }
    
        const order = await prisma.order.findUnique({ where: { id: parseInt(orderID), order_status: status ?? undefined } });
        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: `Order with ID ${orderID} not found` });
        }
        if (order.user_id !== req.userId) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "You are not authorized to view this order" });
        }
        return res.status(StatusCodes.OK).json({order});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while retrieving orders" });
    }   
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                user: true
            }
        });
        return res.status(StatusCodes.OK).json({orders});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while retrieving orders" });
    }
}



module.exports = {
    getOrders,
    getAllOrders
}
