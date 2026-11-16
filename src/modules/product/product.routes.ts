import express = require('express');
const router = express.Router();
import ProductController = require("./product.controller");
import { authMiddleware, authorize } from "../../middlewares/auth.middlewares";
import { validateProductId, validateCreateProduct, validateUpdateProduct } from "./product.valedation";


router.get('/', (req, res) => ProductController.getAllProducts(req, res));
// @ts-expect-error TS(2345): Argument of type 'Request<{ id: string | Uint8Arra... Remove this comment to see the full error message
router.get('/:id', validateProductId, (req, res) => ProductController.getProductById(req, res));

// @ts-expect-error TS(2769): No overload matches this call.
router.post('/', authMiddleware, authorize(['admin']), validateCreateProduct, (req, res) => ProductController.createProduct(req, res));
// @ts-expect-error TS(2769): No overload matches this call.
router.put('/:id', authMiddleware, authorize(['admin']), validateProductId, validateUpdateProduct, (req, res) => ProductController.updateProduct(req, res));
// @ts-expect-error TS(2769): No overload matches this call.
router.delete('/:id', authMiddleware, authorize(['admin']), validateProductId, (req, res) => ProductController.deleteProduct(req, res));

export = router;
