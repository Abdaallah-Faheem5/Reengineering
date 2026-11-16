import express = require('express');
const router = express.Router();
import wishlistController = require("./wishlist.controller");
import { authMiddleware } from "../../middlewares/auth.middlewares";
import { validateWishlistProductBody, validateWishlistProductParam } from "./wishlist.validation";

// @ts-expect-error TS(2769): No overload matches this call.
router.use(authMiddleware);

// @ts-expect-error TS(2769): No overload matches this call.
router.get('/', wishlistController.getMyWishlist);
// @ts-expect-error TS(2769): No overload matches this call.
router.post('/items', validateWishlistProductBody, wishlistController.addProduct);
// @ts-expect-error TS(2769): No overload matches this call.
router.delete('/items/:productId', validateWishlistProductParam, wishlistController.removeProduct);
// @ts-expect-error TS(2769): No overload matches this call.
router.delete('/', wishlistController.clearWishlist);

export = router;
