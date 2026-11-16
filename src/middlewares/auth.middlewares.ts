import { verifyToken } from '../utils/jwt.utils';
import { Types } from "mongoose";
import User = require('../models/user.model');

const authMiddleware = async (req: { headers: { authorization: any; }; user: { fullName: string; phone: string; password: string; role: "user" | "admin"; createdAt: NativeDate; updatedAt: NativeDate; } & { _id: Types.ObjectId; } & { __v: number; } & Required<{ _id: Types.ObjectId; }>; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: string; }): any; new(): any; }; }; }, next: () => any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const userId = decoded.userId || decoded.UserId;

    const user = await User.findById(userId).select('-password').lean();
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح'
      });
    }

    req.user = user;
    return next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح'
    });
  }
};

const authorize = (roles: string[]) => {
  const normalizedRoles = Array.isArray(roles) ? roles : [roles];

  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح'
      });
    }

    if (!normalizedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'غير مسموح'
      });
    }

    return next();
  };
};

export { authMiddleware, authorize };
