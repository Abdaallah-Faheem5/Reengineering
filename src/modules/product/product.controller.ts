import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import ProductService = require("./product.service");

const getStatusCode = (error: any) => {
    const statusCode = Number(error?.statusCode ?? error?.status);
    return Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599
        ? statusCode
        : 500;
};

class ProductController {
    async createProduct(req: Request<any, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
        try {
            const product = await ProductService.createProduct(req.body);
            res.status(201).json({
                success: true,
                message: 'تم إنشاء المنتج بنجاح',
                data: product
            });
        } catch (error) {
            return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
        }
    }

    async getAllProducts(req: Request<any, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
        try {
            const products = await ProductService.getAllProducts();
            res.json({
                success: true,
                message: 'تم جلب المنتجات بنجاح',
                data: products
            });
        } catch (error) {
            return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
        }
    }

    async getProductById(req: Request<{ id: string; }, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            res.json({
                success: true,
                message: 'تم جلب المنتج بنجاح',
                data: product
            });
        } catch (error) {
            return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
        }
    }

    async updateProduct(req: Request<{ id: string; }, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
        try {
            const product = await ProductService.updateProduct(req.params.id, req.body);
            res.json({
                success: true,
                message: 'تم تحديث المنتج بنجاح',
                data: product
            });
        } catch (error) {
            return res.status(getStatusCode(error)).json({
    success: false,
    message: (error as any).message,
    error: (error as any).message
});
        }

    }

    async deleteProduct(req: Request<{ id: string; }, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
        try {
            await ProductService.deleteProduct(req.params.id);
            res.json({
                success: true,
                message: 'تم حذف المنتج بنجاح'
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

export = new ProductController();