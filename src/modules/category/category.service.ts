import Category = require("../../models/category.model");
import Product = require("../../models/product.model");

function createError(status: number, message: string | undefined) {
    const err = new Error(message);
    (err as any).status = status;
    (err as any).statusCode = status;
    return err;
}

class CategoryService {
    async createCategory(data: any) {
        const existing = await Category.findOne({ name: data.name.trim() });
        if (existing) throw createError(409, 'هذا التصنيف موجود مسبقاً');

        const category = await Category.create({ ...data, name: data.name.trim() });
        return category;
    }

    async getAllCategories() {
        return Category.find({}).sort({ createdAt: -1 });
    }

    async getCategoryById(id: any) {
        const category = await Category.findById(id);
        if (!category) throw createError(404, 'التصنيف غير موجود');
        return category;
    }

    async updateCategory(id: any, data: any) {
        const category = await Category.findById(id);
        if (!category) throw createError(404, 'التصنيف غير موجود');

        if (data.name !== undefined) {
            const duplicate = await Category.findOne({ name: data.name.trim(), _id: { $ne: id } });
            if (duplicate) throw createError(409, 'هذا الاسم مستخدم بالفعل');
            data.name = data.name.trim();
        }

        const updated = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        return updated;
    }

    async deleteCategory(id: any) {
        const category = await Category.findById(id);
        if (!category) throw createError(404, 'التصنيف غير موجود');

        const productsCount = await Product.countDocuments({ category: id });
        if (productsCount > 0) {
            throw createError(409, 'لا يمكن حذف التصنيف لأنه مرتبط بمنتجات');
        }

        await Category.findByIdAndDelete(id);
        return { deleted: true };
    }

    async toggleActive(id: any) {
        const category = await Category.findById(id);
        if (!category) throw createError(404, 'التصنيف غير موجود');
        (category as any).isActive = !(category as any).isActive;
        await category.save();
        return category;
    }
}

export = new CategoryService();
