import { Types } from 'mongoose';

const USER_ROLES = ['user', 'admin'];

const createError = (statusCode: number, message: string | undefined) => {
  const error = new Error(message);
  (error as any).status = statusCode;
  (error as any).statusCode = statusCode;
  return error;
};

const normalizePhone = (input: string) => {
  if (typeof input !== 'string') return null;

  const value = input.replace(/\s+/g, '').trim();

  if (/^009627\d{8}$/.test(value)) return value;
  if (/^\+9627\d{8}$/.test(value)) return `00962${value.slice(4)}`;
  if (/^9627\d{8}$/.test(value)) return `00${value}`;
  if (/^07\d{8}$/.test(value)) return `00962${value.slice(1)}`;
  if (/^7\d{8}$/.test(value)) return `00962${value}`;

  return null;
};

const getString = (value: string) => (typeof value === 'string' ? value.trim() : '');

const ensureObjectBody = (body: any) => body && typeof body === 'object' && !Array.isArray(body);

const validateLogin = (req: { body: { phone: any; password: any; }; }, res: any, next: any) => {
  try {
    if (!ensureObjectBody(req.body)) {
      throw createError(400, 'بيانات الطلب غير صالحة');
    }

    const phone = normalizePhone(req.body.phone);
    const password = getString(req.body.password);

    if (!phone || !password) {
      throw createError(400, 'رقم الهاتف وكلمة المرور مطلوبان');
    }

    req.body = { phone, password };
    return next();
  } catch (error) {
    return next(error);
  }
};

const validateRegister = (req: { body: { fullName: any; phone: any; password: any; }; }, res: any, next: any) => {
  try {
    if (!ensureObjectBody(req.body)) {
      throw createError(400, 'بيانات الطلب غير صالحة');
    }

    const fullName = getString(req.body.fullName);
    const phone = normalizePhone(req.body.phone);
    const password = getString(req.body.password);

    if (!fullName || !phone || !password) {
      throw createError(400, 'جميع الحقول مطلوبة');
    }

    if (fullName.length < 3 || fullName.length > 80) {
      throw createError(400, 'الاسم يجب أن يكون بين 3 و 80 حرفاً');
    }

    if (password.length < 6 || password.length > 72) {
      throw createError(400, 'كلمة المرور يجب أن تكون بين 6 و 72 حرفاً');
    }

    req.body = { fullName, phone, password };
    return next();
  } catch (error) {
    return next(error);
  }
};

const buildUpdateValidator = ({ allowRole }: any) => (req: any, res: any, next: any) => {
  try {
    if (!ensureObjectBody(req.body)) {
      throw createError(400, 'بيانات الطلب غير صالحة');
    }

    const payload: { fullName?: string; phone?: string; password?: string; role?: string } = {};

    if (req.body.fullName !== undefined) {
      const fullName = getString(req.body.fullName);
      if (!fullName) throw createError(400, 'الاسم لا يمكن أن يكون فارغاً');
      if (fullName.length < 3 || fullName.length > 80) {
        throw createError(400, 'الاسم يجب أن يكون بين 3 و 80 حرفاً');
      }
      payload.fullName = fullName;
    }

    if (req.body.phone !== undefined) {
      const phone = normalizePhone(req.body.phone);
      if (!phone) throw createError(400, 'رقم الهاتف غير صالح');
      payload.phone = phone;
    }

    if (req.body.password !== undefined) {
      const password = getString(req.body.password);
      if (password.length < 6 || password.length > 72) {
        throw createError(400, 'كلمة المرور يجب أن تكون بين 6 و 72 حرفاً');
      }
      payload.password = password;
    }

    if (allowRole && req.body.role !== undefined) {
      const role = getString(req.body.role).toLowerCase();
      if (!USER_ROLES.includes(role)) {
        throw createError(400, 'قيمة الدور غير صالحة');
      }
      payload.role = role;
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

const validateObjectIdParam = (paramName = 'id') => (req: any, res: any, next: any) => {
  try {
    const value = req.params?.[paramName];
    if (!Types.ObjectId.isValid(value)) {
      throw createError(400, 'معرّف المستخدم غير صالح');
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

export const validateUpdateMe = buildUpdateValidator({ allowRole: false });
export const validateAdminUpdate = buildUpdateValidator({ allowRole: true });
export { validateLogin, validateRegister, validateObjectIdParam };
