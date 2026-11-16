import { Types } from 'mongoose';
import { ObjectId } from "bson";

const ORDER_STATUSES = ['pending', 'paid', 'shipped'];

const createError = (statusCode: number, message: string | undefined) => {
    const error = new Error(message);
    (error as any).status = statusCode;
    (error as any).statusCode = statusCode;
    return error;
};

const ensureObjectBody = (body: any) => body && typeof body === 'object' && !Array.isArray(body);

const getString = (value: string) => (typeof value === 'string' ? value.trim() : '');

const validateCreateOrder = (req: { body: { city: any; }; }, res: any, next: any) => {
    try {
        if (!ensureObjectBody(req.body)) {
            throw createError(400, 'Invalid request body');
        }

        const city = getString(req.body.city);
        if (!city) {
            throw createError(400, 'City is required');
        }

        if (city.length < 2 || city.length > 80) {
            throw createError(400, 'City must be between 2 and 80 characters');
        }

        req.body = { city };
        return next();
    } catch (error) {
        return next(error);
    }
};

const validateOrderIdParam = (paramName = 'orderId') => (req: any, res: any, next: any) => {
    try {
        if (!Types.ObjectId.isValid(req.params?.[paramName])) {
            throw createError(400, 'Invalid order id');
        }
        return next();
    } catch (error) {
        return next(error);
    }
};

const validateUpdateOrderStatus = (req: { body: { status: any; }; }, res: any, next: any) => {
    try {
        if (!ensureObjectBody(req.body)) {
            throw createError(400, 'Invalid request body');
        }

        const status = getString(req.body.status).toLowerCase();
        if (!status) {
            throw createError(400, 'Status is required');
        }

        if (!ORDER_STATUSES.includes(status)) {
            throw createError(400, 'Invalid status value');
        }

        req.body = { status };
        return next();
    } catch (error) {
        return next(error);
    }
};

export { validateCreateOrder, validateOrderIdParam, validateUpdateOrderStatus };
