import express = require('express');
const router = express.Router();
import authController = require("./auth.controller");
import { authMiddleware, authorize } from "../../middlewares/auth.middlewares";
import { validateLogin, validateRegister, validateUpdateMe, validateAdminUpdate, validateObjectIdParam } from "./auth.valedation";
import { authLimiter } from "../../middlewares/rateLimit.middlewares";
// @ts-expect-error TS(2769): No overload matches this call.
router.post('/login', authLimiter, validateLogin, authController.login);
// @ts-expect-error TS(2769): No overload matches this call.
router.post('/register', authLimiter, validateRegister, authController.register);
// @ts-expect-error TS(2769): No overload matches this call.
router.post('/logout', authMiddleware, authController.logout);

// @ts-expect-error TS(2769): No overload matches this call.
router.get('/', authMiddleware, authController.getMe);
// @ts-expect-error TS(2769): No overload matches this call.
router.put('/', authMiddleware, validateUpdateMe, authController.updateMe);

// @ts-expect-error TS(2769): No overload matches this call.
router.put('/update/:id', authMiddleware, authorize(['admin']), validateObjectIdParam('id'), validateAdminUpdate, authController.update);

export = router;