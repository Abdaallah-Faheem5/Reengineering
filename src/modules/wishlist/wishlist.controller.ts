import { Document, Types, DefaultTimestampProps } from "mongoose";
import wishlistService = require("./wishlist.service");

const getStatusCode = (error: any) => {
  const statusCode = Number(error?.statusCode ?? error?.status);
  return Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599
    ? statusCode
    : 500;
};

class WishlistController {
  async getMyWishlist(req: { user: { _id: any; }; }, res: { json: (arg0: { success: boolean; message: string; data: Document<unknown, any, { user: Types.ObjectId; products: Types.ObjectId[]; } & DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ user: Types.ObjectId; products: Types.ObjectId[]; } & DefaultTimestampProps & { _id: Types.ObjectId; } & { __v: number; }, "id"> & { id: string; }; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
    try {
      const wishlist = await wishlistService.getWishlistByUserId(req.user._id);
      return res.json({
        success: true,
        message: 'Wishlist fetched successfully',
        data: wishlist
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
    }
  }

  async addProduct(req: { user: { _id: any; }; body: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; data?: Document<unknown, any, { user: Types.ObjectId; products: Types.ObjectId[]; } & DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ user: Types.ObjectId; products: Types.ObjectId[]; } & DefaultTimestampProps & { _id: Types.ObjectId; } & { __v: number; }, "id"> & { id: string; }; error?: any; }): any; new(): any; }; }; }) {
    try {
      const wishlist = await wishlistService.addProduct(req.user._id, req.body);
      return res.status(201).json({
        success: true,
        message: 'Product added to wishlist successfully',
        data: wishlist
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
    }
  }

  async removeProduct(req: { user: { _id: any; }; params: { productId: any; }; }, res: { json: (arg0: { success: boolean; message: string; data: Document<unknown, any, { user: Types.ObjectId; products: Types.ObjectId[]; } & DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ user: Types.ObjectId; products: Types.ObjectId[]; } & DefaultTimestampProps & { _id: Types.ObjectId; } & { __v: number; }, "id"> & { id: string; }; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
    try {
      const wishlist = await wishlistService.removeProduct(req.user._id, req.params.productId);
      return res.json({
        success: true,
        message: 'Product removed from wishlist successfully',
        data: wishlist
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
    }
  }

  async clearWishlist(req: { user: { _id: any; }; }, res: { json: (arg0: { success: boolean; message: string; data: Document<unknown, any, { user: Types.ObjectId; products: Types.ObjectId[]; } & DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ user: Types.ObjectId; products: Types.ObjectId[]; } & DefaultTimestampProps & { _id: Types.ObjectId; } & { __v: number; }, "id"> & { id: string; }; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
    try {
      const wishlist = await wishlistService.clearWishlist(req.user._id);
      return res.json({
        success: true,
        message: 'Wishlist cleared successfully',
        data: wishlist
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

export = new WishlistController();
