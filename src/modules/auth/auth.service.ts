import { hashPassword, comparePassword } from "../../utils/hash.utils";
import { generateToken } from "../../utils/jwt.utils";
import User = require("../../models/user.model");

function createError(status: number, message: string | undefined) {
  const err = new Error(message);
  (err as any).status = status;
  (err as any).statusCode = status;
  return err;
}

class AuthService {
  async login({ phone, password }: any) {
    const user = await User.findOne({ phone }).select('+password');
    if (!user) throw createError(401, 'رقم الهاتف أو كلمة المرور غير صحيحة');

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw createError(401, 'رقم الهاتف أو كلمة المرور غير صحيحة');

    const token = generateToken({ userId: user._id, role: user.role });

    const safeUser = await User.findById(user._id).select('-password').lean();
    return { user: safeUser, token };
  }

  async register({ fullName, phone, password }: any) {
    const existingUser = await User.findOne({ phone });
    if (existingUser) throw createError(409, 'رقم الهاتف مسجل مسبقاً');

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      fullName,
      phone,
      password: hashedPassword,
      role: 'user'
    });

    const token = generateToken({ userId: newUser._id, role: newUser.role });

    const safeUser = await User.findById(newUser._id).select('-password').lean();
    return { user: safeUser, token };
  }

  async getMe(userId: any) {
    const user = await User.findById(userId).select('-password').lean();
    if (!user) throw createError(404, 'المستخدم غير موجود');
    return user;
  }

  async update(id: any, payload: { [x: string]: any; password: any; }) {
    const { password, ...rest } = payload;
    const updateData = { ...rest };

    if (password) {
      updateData.password = await hashPassword(password);
    }

    return User.findByIdAndUpdate(id, updateData, { new: true })
      .select('-password')
      .lean();
  }

}
export = new AuthService();