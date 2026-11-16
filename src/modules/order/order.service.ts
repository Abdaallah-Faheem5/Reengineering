import { Types } from "mongoose";
import Order = require("../../models/order.model");
import Cart = require("../../models/cart.model");
import Product = require("../../models/product.model");
import User = require("../../models/user.model");

function createError(status: number, message: string | undefined) {
    const err = new Error(message);
    (err as any).status = status;
    (err as any).statusCode = status;
    return err;
}

class OrderService {
    async createOrderFromCart(userId: any, payload: { city: any; }) {
        const user = await User.findById(userId).select('fullName phone').lean();
        if (!user) {
            throw createError(404, 'User not found');
        }

        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            throw createError(400, 'Cart is empty');
        }

        const productIds = cart.items.map((item) => item.product?._id || item.product);
        const products = await Product.find({ _id: { $in: productIds } })
            .select('name price stock')
            .lean();

        const productsMap = new Map(products.map((product) => [String(product._id), product]));
        const items = [];
        let total = 0;

        for (const cartItem of cart.items) {
            const productId = String(cartItem.product?._id || cartItem.product);
            const product = productsMap.get(productId);

            if (!product) {
                throw createError(404, 'A product in cart no longer exists');
            }

            if (product.stock !== undefined && cartItem.qty > product.stock) {
                throw createError(400, `Requested quantity is not available for ${product.name}`);
            }

            const qty = Number(cartItem.qty);
            const price = Number(product.price);
            const lineTotal = qty * price;

            items.push({
                product: product._id,
                productName: product.name,
                qty,
                price,
                lineTotal
            });

            total += lineTotal;
        }

        const order = await Order.create({
            user: userId,
            customer: {
                fullName: user.fullName,
                phone: user.phone,
                city: payload.city
            },
            items,
            total,
            status: 'pending'
        });

        // @ts-expect-error TS(2740): Type 'never[]' is missing the following properties... Remove this comment to see the full error message
        cart.items = [];
        await cart.save();

        return this.getOrderById(order._id);
    }

    async getMyOrders(userId: any) {
        return Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate('items.product', 'name price image')
            .lean();
    }

    async getAllOrders() {
        return Order.find()
            .sort({ createdAt: -1 })
            .populate('user', 'fullName phone role')
            .populate('items.product', 'name price image')
            .lean();
    }

    async updateOrderStatus(orderId: any, status: any) {
        const order = await Order.findById(orderId);
        if (!order) {
            throw createError(404, 'Order not found');
        }

        order.status = status;
        await order.save();

        return this.getOrderById(order._id);
    }

    async getOrderById(orderId: Types.ObjectId) {
        const order = await Order.findById(orderId)
            .populate('user', 'fullName phone role')
            .populate('items.product', 'name price image')
            .lean();

        if (!order) {
            throw createError(404, 'Order not found');
        }

        return order;
    }
}

export = new OrderService();
