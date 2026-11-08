import { Router, type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import { requireAuth, requireSeller } from "../middleware/auth.middleware.js";
import { createProduct } from "../controllers/product.controller.js";
import { MAX_PRODUCT_IMAGES, validateCreateProduct } from "../validator/product.validator.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const uploadProductImages = upload.array("images", MAX_PRODUCT_IMAGES);

function handleProductImageUpload(req: Request, res: Response, next: NextFunction) {
    uploadProductImages(req, res, (error) => {
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ error: error.message });
        }

        if (error) {
            return res.status(400).json({ error: "Failed to process the uploaded images" });
        }

        next();
    });
}

const router = Router();

router.post("/create-product", requireAuth, requireSeller, handleProductImageUpload, validateCreateProduct, createProduct);

export default router;
