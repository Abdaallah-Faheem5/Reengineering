import { ObjectId } from "bson";
import { Types } from "mongoose";
import orderService = require("./order.service");

const getStatusCode = (error: any) => {
    const statusCode = Number(error?.statusCode ?? error?.status);
    return Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599
        ? statusCode
        : 500;
};

class OrderController {
    async createOrder(req: { user: { _id: any; }; body: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; data?: { user: Types.ObjectId; items: Types.DocumentArray<{ product: Types.ObjectId; productName: string; qty: number; price: number; lineTotal: number; } | { product: string; productName: string; qty: number; price: number; lineTotal: number; _id: string; }, Types.Subdocument<string | ObjectId, unknown, { product: Types.ObjectId; productName: string; qty: number; price: number; lineTotal: number; } | { product: string; productName: string; qty: number; price: number; lineTotal: number; _id: string; }> & ({ product: Types.ObjectId; productName: string; qty: number; price: number; lineTotal: number; } | { product: string; productName: string; qty: number; price: number; lineTotal: number; _id: string; })>; total: number; status: "pending" | "paid" | "shipped"; customer?: { fullName: string; phone: string; city: string; } | null | undefined; createdAt: NativeDate; updatedAt: NativeDate; } & { _id: Types.ObjectId; } & { __v: number; } & Required<{ _id: Types.ObjectId; }>; error?: any; }): any; new(): any; }; }; }) {
        try {
            const order = await orderService.createOrderFromCart(req.user._id, req.body);
            return res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                data: order
            });
        } catch (error) {
            return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
        }
    }

    async getMyOrders(req: { user: { _id: any; }; }, res: { json: (arg0: { success: boolean; message: string; data: ({ user: Types.ObjectId; items: Types.DocumentArray<{ product: Types.ObjectId; productName: string; qty: number; price: number; lineTotal: number; } | { product: string; productName: string; qty: number; price: number; lineTotal: number; _id: string; }, Types.Subdocument<string | ObjectId, unknown, { product: Types.ObjectId; productName: string; qty: number; price: number; lineTotal: number; } | { product: string; productName: string; qty: number; price: number; lineTotal: number; _id: string; }> & ({ product: Types.ObjectId; productName: string; qty: number; price: number; lineTotal: number; } | { product: string; productName: string; qty: number; price: number; lineTotal: number; _id: string; })>; total: number; status: "pending" | "paid" | "shipped"; customer?: { fullName: string; phone: string; city: string; } | null | undefined; createdAt: NativeDate; updatedAt: NativeDate; } & { _id: Types.ObjectId; } & { __v: number; } & Required<{ _id: Types.ObjectId; }>)[]; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
        try {
            const orders = await orderService.getMyOrders(req.user._id);
            return res.json({
                success: true,
                message: 'Orders fetched successfully',
                data: orders
            });
        } catch (error) {
            return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
        }
    }

    async getAllOrdersForAdmin(req: any, res: { json: (arg0: { success: boolean; message: string; data: ({ user: Types.ObjectId; items: Types.DocumentArray<{ product: Types.ObjectId; productName: string; qty: number; price: number; lineTotal: number; } | { product: string; productName: string; qty: number; price: number; lineTotal: number; _id: string; }, Types.Subdocument<string | ObjectId, unknown, { product: Types.ObjectId; productName: string; qty: number; price: number; lineTotal: number; } | { product: string; productName: string; qty: number; price: number; lineTotal: number; _id: string; }> & ({ product: Types.ObjectId; productName: string; qty: number; price: number; lineTotal: number; } | { product: string; productName: string; qty: number; price: number; lineTotal: number; _id: string; })>; total: number; status: "pending" | "paid" | "shipped"; customer?: { fullName: string; phone: string; city: string; } | null | undefined; createdAt: NativeDate; updatedAt: NativeDate; } & { _id: Types.ObjectId; } & { __v: number; } & Required<{ _id: Types.ObjectId; }>)[]; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
        try {
            const orders = await orderService.getAllOrders();
            return res.json({
                success: true,
                message: 'All orders fetched successfully',
                data: orders
            });
        } catch (error) {
            return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
        }
    }

    async updateOrderStatus(req: { params: { orderId: any; }; body: { status: any; }; }, res: { json: (arg0: { success: boolean; message: string; data: { user: Types.ObjectId; items: Types.DocumentArray<{ product: Types.ObjectId; productName: string; qty: number; price: number; lineTotal: number; } | { product: string; productName: string; qty: number; price: number; lineTotal: number; _id: string; }, Types.Subdocument<string | ObjectId, unknown, { product: Types.ObjectId; productName: string; qty: number; price: number; lineTotal: number; } | { product: string; productName: string; qty: number; price: number; lineTotal: number; _id: string; }> & ({ product: Types.ObjectId; productName: string; qty: number; price: number; lineTotal: number; } | { product: string; productName: string; qty: number; price: number; lineTotal: number; _id: string; })>; total: number; status: "pending" | "paid" | "shipped"; customer?: { fullName: string; phone: string; city: string; } | null | undefined; createdAt: NativeDate; updatedAt: NativeDate; } & { _id: Types.ObjectId; } & { __v: number; } & Required<{ _id: Types.ObjectId; }>; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
        try {
            const order = await orderService.updateOrderStatus(req.params.orderId, req.body.status);
            return res.json({
                success: true,
                message: 'Order status updated successfully',
                data: order
            });
        } catch (error) {
            return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
        }
    }
}

export = new OrderController();
