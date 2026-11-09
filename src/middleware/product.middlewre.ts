import multer from "multer";
import type { Request, Response, NextFunction } from "express";
import { MAX_PRODUCT_IMAGES } from "../validator/product.validator.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const uploadProductImages = upload.array("images", MAX_PRODUCT_IMAGES);

export function handleProductImageUpload(req: Request, res: Response, next: NextFunction) {
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