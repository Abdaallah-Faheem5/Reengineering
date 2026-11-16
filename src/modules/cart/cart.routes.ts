import express = require('express');
const router = express.Router();
import cartController = require("./cart.controller");
import { authMiddleware } from "../../middlewares/auth.middlewares";
import { validateItemIdParam, validateAddItem, validateUpdateItemQty } from "./cart.valedation";

// @ts-expect-error TS(2769): No overload matches this call.
router.use(authMiddleware);

// @ts-expect-error TS(2769): No overload matches this call.
router.get('/', cartController.getMyCart);
// @ts-expect-error TS(2769): No overload matches this call.
router.post('/items', validateAddItem, cartController.addItem);
// @ts-expect-error TS(2769): No overload matches this call.
router.patch('/items/:itemId', validateItemIdParam('itemId'), validateUpdateItemQty, cartController.updateItemQty);
// @ts-expect-error TS(2769): No overload matches this call.
router.delete('/items/:itemId', validateItemIdParam('itemId'), cartController.removeItem);
// @ts-expect-error TS(2769): No overload matches this call.
router.delete('/', cartController.clearCart);

export = router;
