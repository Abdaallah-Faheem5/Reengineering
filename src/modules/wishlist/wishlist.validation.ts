import { Types } from 'mongoose';

const createError = (statusCode: number, message: string | undefined) => {
  const error = new Error(message);
  (error as any).status = statusCode;
  (error as any).statusCode = statusCode;
  return error;
};

const ensureObjectBody = (body: any) => body && typeof body === 'object' && !Array.isArray(body);

const validateWishlistProductBody = (req: { body: { productId: any; }; }, res: any, next: any) => {
  try {
    if (!ensureObjectBody(req.body)) {
      throw createError(400, 'Request body is invalid');
    }

    const productId = typeof req.body.productId === 'string'
      ? req.body.productId.trim()
      : '';

    if (!Types.ObjectId.isValid(productId)) {
      throw createError(400, 'Product id is invalid');
    }

    req.body = { productId };
    return next();
  } catch (error) {
    return next(error);
  }
};

const validateWishlistProductParam = (req: { params: { productId: any; }; }, res: any, next: any) => {
  try {
    const { productId } = req.params;
    if (!Types.ObjectId.isValid(productId)) {
      throw createError(400, 'Product id is invalid');
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

export { validateWishlistProductBody, validateWishlistProductParam };
