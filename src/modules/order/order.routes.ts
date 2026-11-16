import express = require('express');
const router = express.Router();
import orderController = require("./order.controller");
import { authMiddleware, authorize } from "../../middlewares/auth.middlewares";
import { validateCreateOrder, validateOrderIdParam, validateUpdateOrderStatus } from "./order.validation";

// @ts-expect-error TS(2769): No overload matches this call.
router.use(authMiddleware);

// @ts-expect-error TS(2769): No overload matches this call.
router.post('/', validateCreateOrder, orderController.createOrder);
// @ts-expect-error TS(2769): No overload matches this call.
router.get('/my', orderController.getMyOrders);
// @ts-expect-error TS(2769): No overload matches this call.
router.get('/admin/all', authorize(['admin']), orderController.getAllOrdersForAdmin);
router.patch(
    '/admin/:orderId/status',
    authorize(['admin']),
    validateOrderIdParam('orderId'),
    validateUpdateOrderStatus,
    // @ts-expect-error TS(2769): No overload matches this call.
    orderController.updateOrderStatus
);

export = router;
