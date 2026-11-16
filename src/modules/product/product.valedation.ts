import { Types } from 'mongoose';
import { ObjectId, ObjectIdLike } from "bson";

const createError = (statusCode: number, message: string | undefined) => {
  const error = new Error(message);
  (error as any).status = statusCode;
  (error as any).statusCode = statusCode;
  return error;
};

const ensureObjectBody = (body: any) => body && typeof body === 'object' && !Array.isArray(body);

const getString = (value: string) => (typeof value === 'string' ? value.trim() : '');

const parseNumber = (value: unknown) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const validateProductId = (req: { params: { id: string | ObjectId | ObjectIdLike | Uint8Array<ArrayBufferLike>; }; }, res: any, next: any) => {
  try {
    if (!Types.ObjectId.isValid(req.params?.id)) {
      throw createError(400, 'معرّف المنتج غير صالح');
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

const validateCreateProduct = (req: { body: { name: any; price: any; category: any; image: any; description: any; stock: any; }; }, res: any, next: any) => {
  try {
    if (!ensureObjectBody(req.body)) {
      throw createError(400, 'بيانات الطلب غير صالحة');
    }

    const name = getString(req.body.name);
    const price = parseNumber(req.body.price);
    const category = getString(req.body.category);
    const image = req.body.image === undefined ? '' : getString(req.body.image);
    const description =
      req.body.description === undefined ? '' : getString(req.body.description);
    const stock = req.body.stock === undefined ? 0 : parseNumber(req.body.stock);

    if (!name) throw createError(400, 'اسم المنتج مطلوب');
    if (name.length > 150) throw createError(400, 'اسم المنتج طويل جداً');

    if (price === null || price < 0) {
      throw createError(400, 'السعر يجب أن يكون رقماً أكبر من أو يساوي 0');
    }

    if (!category) throw createError(400, 'الفئة مطلوبة');
    if (!Types.ObjectId.isValid(category)) {
      throw createError(400, 'معرّف الفئة غير صالح');
    }

    if (stock === null || stock < 0) {
      throw createError(400, 'المخزون يجب أن يكون رقماً أكبر من أو يساوي 0');
    }

    req.body = { name, price, category, image, description, stock };
    return next();
  } catch (error) {
    return next(error);
  }
};

const validateUpdateProduct = (req: { body: { name?: any; price?: any; category?: any; image?: any; description?: any; stock?: any; }; }, res: any, next: any) => {
  try {
    if (!ensureObjectBody(req.body)) {
      throw createError(400, 'بيانات الطلب غير صالحة');
    }

    const payload: { name?: string; price?: number; category?: string; image?: string; description?: string; stock?: number } = {};

    if (req.body.name !== undefined) {
      const name = getString(req.body.name);
      if (!name) throw createError(400, 'اسم المنتج لا يمكن أن يكون فارغاً');
      if (name.length > 150) throw createError(400, 'اسم المنتج طويل جداً');
      payload.name = name;
    }

    if (req.body.price !== undefined) {
      const price = parseNumber(req.body.price);
      if (price === null || price < 0) {
        throw createError(400, 'السعر يجب أن يكون رقماً أكبر من أو يساوي 0');
      }
      payload.price = price;
    }

    if (req.body.category !== undefined) {
      const category = getString(req.body.category);
      if (!Types.ObjectId.isValid(category)) {
        throw createError(400, 'معرّف الفئة غير صالح');
      }
      payload.category = category;
    }

    if (req.body.image !== undefined) {
      payload.image = getString(req.body.image);
    }

    if (req.body.description !== undefined) {
      payload.description = getString(req.body.description);
    }

    if (req.body.stock !== undefined) {
      const stock = parseNumber(req.body.stock);
      if (stock === null || stock < 0) {
        throw createError(400, 'المخزون يجب أن يكون رقماً أكبر من أو يساوي 0');
      }
      payload.stock = stock;
    }

    if (Object.keys(payload).length === 0) {
      throw createError(400, 'لا توجد بيانات صالحة للتحديث');
    }

    req.body = payload;
    return next();
  } catch (error) {
    return next(error);
  }
};

export { validateProductId, validateCreateProduct, validateUpdateProduct };
