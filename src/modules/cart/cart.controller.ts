import { ObjectId } from "bson";
import { Document, Types, DefaultTimestampProps } from "mongoose";
import cartService = require("./cart.service");

const getStatusCode = (error: any) => {
  const statusCode = Number(error?.statusCode ?? error?.status);
  return Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599
    ? statusCode
    : 500;
};

class CartController {
  async getMyCart(req: { user: { _id: any; }; }, res: { json: (arg0: { success: boolean; message: string; data: Document<unknown, any, { user: Types.ObjectId; items: Types.DocumentArray<{ product: Types.ObjectId; qty: number; price: number; }, Types.Subdocument<ObjectId, unknown, { product: Types.ObjectId; qty: number; price: number; }> & { product: Types.ObjectId; qty: number; price: number; }>; totalPrice: number; } & DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ user: Types.ObjectId; items: Types.DocumentArray<{ product: Types.ObjectId; qty: number; price: number; }, Types.Subdocument<ObjectId, unknown, { product: Types.ObjectId; qty: number; price: number; }> & { product: Types.ObjectId; qty: number; price: number; }>; totalPrice: number; } & DefaultTimestampProps & { _id: Types.ObjectId; } & { __v: number; }, "id"> & { id: string; }; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
    try {
      const cart = await cartService.getCartByUserId(req.user._id);
      return res.json({
        success: true,
        message: 'تم جلب السلة بنجاح',
        data: cart
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
    }
  }

  async addItem(req: { user: { _id: any; }; body: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; data?: Document<unknown, any, { user: Types.ObjectId; items: Types.DocumentArray<{ product: Types.ObjectId; qty: number; price: number; }, Types.Subdocument<ObjectId, unknown, { product: Types.ObjectId; qty: number; price: number; }> & { product: Types.ObjectId; qty: number; price: number; }>; totalPrice: number; } & DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ user: Types.ObjectId; items: Types.DocumentArray<{ product: Types.ObjectId; qty: number; price: number; }, Types.Subdocument<ObjectId, unknown, { product: Types.ObjectId; qty: number; price: number; }> & { product: Types.ObjectId; qty: number; price: number; }>; totalPrice: number; } & DefaultTimestampProps & { _id: Types.ObjectId; } & { __v: number; }, "id"> & { id: string; }; error?: any; }): any; new(): any; }; }; }) {
    try {
      const cart = await cartService.addItem(req.user._id, req.body);
      return res.status(201).json({
        success: true,
        message: 'تمت إضافة المنتج إلى السلة بنجاح',
        data: cart
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
    }
  }

  async updateItemQty(req: { user: { _id: any; }; params: { itemId: any; }; body: any; }, res: { json: (arg0: { success: boolean; message: string; data: Document<unknown, any, { user: Types.ObjectId; items: Types.DocumentArray<{ product: Types.ObjectId; qty: number; price: number; }, Types.Subdocument<ObjectId, unknown, { product: Types.ObjectId; qty: number; price: number; }> & { product: Types.ObjectId; qty: number; price: number; }>; totalPrice: number; } & DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ user: Types.ObjectId; items: Types.DocumentArray<{ product: Types.ObjectId; qty: number; price: number; }, Types.Subdocument<ObjectId, unknown, { product: Types.ObjectId; qty: number; price: number; }> & { product: Types.ObjectId; qty: number; price: number; }>; totalPrice: number; } & DefaultTimestampProps & { _id: Types.ObjectId; } & { __v: number; }, "id"> & { id: string; }; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
    try {
      const cart = await cartService.updateItemQty(
        req.user._id,
        req.params.itemId,
        req.body
      );
      return res.json({
        success: true,
        message: 'تم تحديث كمية المنتج في السلة بنجاح',
        data: cart
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
    }
  }

  async removeItem(req: { user: { _id: any; }; params: { itemId: any; }; }, res: { json: (arg0: { success: boolean; message: string; data: Document<unknown, any, { user: Types.ObjectId; items: Types.DocumentArray<{ product: Types.ObjectId; qty: number; price: number; }, Types.Subdocument<ObjectId, unknown, { product: Types.ObjectId; qty: number; price: number; }> & { product: Types.ObjectId; qty: number; price: number; }>; totalPrice: number; } & DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ user: Types.ObjectId; items: Types.DocumentArray<{ product: Types.ObjectId; qty: number; price: number; }, Types.Subdocument<ObjectId, unknown, { product: Types.ObjectId; qty: number; price: number; }> & { product: Types.ObjectId; qty: number; price: number; }>; totalPrice: number; } & DefaultTimestampProps & { _id: Types.ObjectId; } & { __v: number; }, "id"> & { id: string; }; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
    try {
      const cart = await cartService.removeItem(req.user._id, req.params.itemId);
      return res.json({
        success: true,
        message: 'تم حذف المنتج من السلة بنجاح',
        data: cart
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
    }
  }

  async clearCart(req: { user: { _id: any; }; }, res: { json: (arg0: { success: boolean; message: string; data: Document<unknown, any, { user: Types.ObjectId; items: Types.DocumentArray<{ product: Types.ObjectId; qty: number; price: number; }, Types.Subdocument<ObjectId, unknown, { product: Types.ObjectId; qty: number; price: number; }> & { product: Types.ObjectId; qty: number; price: number; }>; totalPrice: number; } & DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ user: Types.ObjectId; items: Types.DocumentArray<{ product: Types.ObjectId; qty: number; price: number; }, Types.Subdocument<ObjectId, unknown, { product: Types.ObjectId; qty: number; price: number; }> & { product: Types.ObjectId; qty: number; price: number; }>; totalPrice: number; } & DefaultTimestampProps & { _id: Types.ObjectId; } & { __v: number; }, "id"> & { id: string; }; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
    try {
      const cart = await cartService.clearCart(req.user._id);
      return res.json({
        success: true,
        message: 'تم تفريغ السلة بنجاح',
        data: cart
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

export = new CartController();
