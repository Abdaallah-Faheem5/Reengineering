import { Document, DefaultTimestampProps, Types } from "mongoose";
import CategoryService = require("./category.service");

const getStatusCode = (error: any) => {
  const statusCode = Number(error?.statusCode ?? error?.status);
  return Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599
    ? statusCode
    : 500;
};

class CategoryController {
  async createCategory(req: { body: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; data?: Document<unknown, any, { name: string; } & DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ name: string; } & DefaultTimestampProps & { _id: Types.ObjectId; } & { __v: number; }, "id"> & { id: string; }; error?: any; }): any; new(): any; }; }; }) {
    try {
      const category = await CategoryService.createCategory(req.body);
      return res.status(201).json({
        success: true,
        message: 'تم إنشاء التصنيف بنجاح',
        data: category
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
    }
  }

  async getAllCategories(req: any, res: { json: (arg0: { success: boolean; message: string; data: (Document<unknown, any, { name: string; } & DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ name: string; } & DefaultTimestampProps & { _id: Types.ObjectId; } & { __v: number; }, "id"> & { id: string; })[]; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
    try {
      const categories = await CategoryService.getAllCategories();
      return res.json({
        success: true,
        message: 'تم جلب التصنيفات بنجاح',
        data: categories
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
    }
  }

  async getCategoryById(req: { params: { id: any; }; }, res: { json: (arg0: { success: boolean; data: Document<unknown, any, { name: string; } & DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ name: string; } & DefaultTimestampProps & { _id: Types.ObjectId; } & { __v: number; }, "id"> & { id: string; }; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      return res.json({
        success: true,
        data: category
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
    }
  }

  async updateCategory(req: { params: { id: any; }; body: any; }, res: { json: (arg0: { success: boolean; message: string; data: (Document<unknown, any, { name: string; } & DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ name: string; } & DefaultTimestampProps & { _id: Types.ObjectId; } & { __v: number; }, "id"> & { id: string; }) | null; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
    try {
      const category = await CategoryService.updateCategory(req.params.id, req.body);
      return res.json({
        success: true,
        message: 'تم تحديث التصنيف بنجاح',
        data: category
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
    }
  }

  async deleteCategory(req: { params: { id: any; }; }, res: { json: (arg0: { success: boolean; message: string; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
    try {
      await CategoryService.deleteCategory(req.params.id);
      return res.json({
        success: true,
        message: 'تم حذف التصنيف بنجاح'
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

export = new CategoryController();
