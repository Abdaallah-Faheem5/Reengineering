import { Types } from 'mongoose';
import Product = require("../../models/product.model");

function createError(status: number, message: string | undefined) {
    const err = new Error(message);
    (err as any).status = status;
    (err as any).statusCode = status;
    return err;
}

class ProductService {
    async createProduct(data: { name: string; price: any; category: any; image: any; description: any; stock: any; }) {
        const product = new Product({
            name: data.name.trim(),
            price: data.price,
            category: data.category,
            image: data.image || '',
            description: data.description || '',
            stock: data.stock || 0
        });
        await product.save();
        return product;

    }

    async getAllProducts() {
        return await Product.find().populate('category', 'name');
    }

    async getProductById(id: string) {
        const product = await Product.findById(id).populate('category', 'name');
        if (!product) {
            throw createError(404, 'المنتج غير موجود');
        }
        return product;
    }

    async updateProduct(id: string, data: { name: string | undefined; price: number | undefined; category: Types.ObjectId | undefined; image: string | null | undefined; description: string | null | undefined; stock: number | undefined; }) {
        const product = await Product.findById(id);
        if (!product) {
            throw createError(404, 'المنتج غير موجود');
        }
        if (data.name !== undefined) {
            product.name = data.name.trim();
        }
        if (data.price !== undefined) {
            product.price = data.price;
        }
        if (data.category !== undefined) {
            product.category = data.category;
        }
        if (data.image !== undefined) {
            product.image = data.image;
        }
        if (data.description !== undefined) {
            product.description = data.description;
        }
        if (data.stock !== undefined) {
            product.stock = data.stock;
        }
        await product.save();
        return product;
    }

    async deleteProduct(id: string) {
        const product = await Product.findById(id);
        if (!product) {
            throw createError(404, 'المنتج غير موجود');
        }
        await Product.findByIdAndDelete(id);
        return { deleted: true };
    }
}

export = new ProductService();
