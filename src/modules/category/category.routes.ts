import express = require('express');
const router = express.Router();
import categoryController = require("./category.controller");
import { authMiddleware, authorize } from "../../middlewares/auth.middlewares";
import { validateCategoryId, validateCreateCategory, validateUpdateCategory } from "./category.validation";


// @ts-expect-error TS(2769): No overload matches this call.
router.get('/', categoryController.getAllCategories);
// @ts-expect-error TS(2769): No overload matches this call.
router.get('/:id', validateCategoryId, categoryController.getCategoryById);


// @ts-expect-error TS(2769): No overload matches this call.
router.post('/', authMiddleware, authorize(['admin']), validateCreateCategory, categoryController.createCategory);
// @ts-expect-error TS(2769): No overload matches this call.
router.put('/:id', authMiddleware, authorize(['admin']), validateCategoryId, validateUpdateCategory, categoryController.updateCategory);
// @ts-expect-error TS(2769): No overload matches this call.
router.delete('/:id', authMiddleware, authorize(['admin']), validateCategoryId, categoryController.deleteCategory);

export = router;
