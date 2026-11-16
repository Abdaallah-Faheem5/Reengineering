import { Types } from "mongoose";
import authService = require("./auth.service");

const getStatusCode = (error: any) => {
  const statusCode = Number(error?.statusCode ?? error?.status);
  return Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599
    ? statusCode
    : 500;
};

const sendAuthError = (
  res: { status: (code: number) => { json: (body: { success: boolean; message: any; error: any }) => any } },
  error: any
) => {
  return res.status(getStatusCode(error)).json({
    success: false,
    message: error.message,
    error: error.message
  });
};

class AuthController {
  async login(req: { body: { phone: any; password: any; }; }, res: { json: (arg0: { success: boolean; message: string; data: { user: ({ fullName: string; phone: string; password: string; role: "user" | "admin"; createdAt: NativeDate; updatedAt: NativeDate; } & { _id: Types.ObjectId; } & { __v: number; } & Required<{ _id: Types.ObjectId; }>) | null; token: any; }; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
    try {
      const data = await authService.login(req.body);

      return res.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        data
      });
    } catch (error) {
      return sendAuthError(res, error);
    }
  }

  async register(req: { body: { fullName: any; phone: any; password: any; }; }, res: { json: (arg0: { success: boolean; message: string; data: { user: ({ fullName: string; phone: string; password: string; role: "user" | "admin"; createdAt: NativeDate; updatedAt: NativeDate; } & { _id: Types.ObjectId; } & { __v: number; } & Required<{ _id: Types.ObjectId; }>) | null; token: any; }; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
    try {
      const data = await authService.register(req.body);

      return res.json({
        success: true,
        message: 'تم التسجيل بنجاح',
        data
      });
    } catch (error) {
      return sendAuthError(res, error);
    }
  }

  async logout(req: any, res: { json: (arg0: { success: boolean; message: string; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
    try {
      return res.json({
        success: true,
        message: 'تم تسجيل الخروج بنجاح'
      });
    } catch (error) {
      return sendAuthError(res, error);
    }
  }

  async getMe(req: { user: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: string; }): any; new(): any; }; }; json: (arg0: { success: boolean; data: any; }) => any; }) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح'
      });
    }

    return res.json({
      success: true,
      data: req.user
    });
  }

  async updateMe(req: { user: { _id: any; }; body: any; }, res: { json: (arg0: { success: boolean; data: ({ fullName: string; phone: string; password: string; role: "user" | "admin"; createdAt: NativeDate; updatedAt: NativeDate; } & { _id: Types.ObjectId; } & { __v: number; } & Required<{ _id: Types.ObjectId; }>) | null; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
    try {
      const user = await authService.update(req.user._id, req.body);
      return res.json({
        success: true,
        data: user
      });
    } catch (error) {
      return sendAuthError(res, error);
    }
  }

  async update(req: { params: { id: any; }; body: any; }, res: { json: (arg0: { success: boolean; data: ({ fullName: string; phone: string; password: string; role: "user" | "admin"; createdAt: NativeDate; updatedAt: NativeDate; } & { _id: Types.ObjectId; } & { __v: number; } & Required<{ _id: Types.ObjectId; }>) | null; }) => any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; error: any; }): any; new(): any; }; }; }) {
    try {
      const user = await authService.update(req.params.id, req.body);
      return res.json({
        success: true,
        data: user
      });
    } catch (error) {
      return sendAuthError(res, error);
    }
  }
}

export = new AuthController();
