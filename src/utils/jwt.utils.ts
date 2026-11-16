import jwt = require('jsonwebtoken');
import env = require('../config/env.config');
import { Types } from 'mongoose';

const generateToken = (payload: { userId: Types.ObjectId; role: "user" | "admin"; }, expiresIn = env.JWT_EXPIRES_IN) => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token: any) => {
    return jwt.verify(token, env.JWT_SECRET);
};

export { generateToken, verifyToken };
