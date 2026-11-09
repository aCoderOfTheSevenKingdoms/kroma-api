import { Router } from "express";
import { requireAuth, requireSeller } from "../middleware/auth.middleware.js";
import { createProduct, getProductsForSeller } from "../controllers/product.controller.js";
import { validateCreateProduct } from "../validator/product.validator.js";
import { handleProductImageUpload } from "../middleware/product.middlewre.js";

const router = Router();

router.post("/create-product", requireAuth, requireSeller, handleProductImageUpload, validateCreateProduct, createProduct);
router.get("/seller", requireAuth, requireSeller, getProductsForSeller);

export default router;
