import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const MAX_PRODUCT_IMAGES = 10;

export type VariantPayload = {
    sku: string;
    size: string;
    color: string;
    price: number;
    stock: number;
    images: Array<string | number>;
};

export type CreateProductBody = {
    title: string;
    slug?: string;
    description: string;
    category: string;
    basePrice: string;
    attributes: Map<string, string>;
    variants: VariantPayload[];
    isActive?: string;
};

function validateRequest(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

function parseJson(value: unknown) {
    if (typeof value !== "string" || value.trim() === "") {
        return undefined;
    }

    return JSON.parse(value) as unknown;
}

function validateProductImages(req: Request, res: Response, next: NextFunction) {
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    if (files.length > MAX_PRODUCT_IMAGES) {
        return res.status(400).json({
            errors: [{
                type: "field",
                msg: `A product can have at most ${MAX_PRODUCT_IMAGES} images`,
                path: "images",
                location: "body"
            }]
        });
    }
    next();
}

function validateAttributes(value: unknown) {
    let parsed: unknown;

    try {
        parsed = parseJson(value);
    } catch {
        throw new Error("attributes must be a valid JSON object");
    }

    if (parsed === undefined) {
        return true;
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        throw new Error("attributes must be a valid JSON object");
    }

    return true;
}

function sanitizeAttributes(value: unknown) {
    let parsed: unknown;

    try {
        parsed = parseJson(value);
    } catch {
        return new Map<string, string>();
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        return new Map<string, string>();
    }

    return new Map(
        Object.entries(parsed).map(([key, attribute]) => [key, String(attribute)])
    );
}

function validateVariants(value: unknown) {
    let parsed: unknown;

    try {
        parsed = parseJson(value);
    } catch {
        throw new Error("variants must be a valid JSON array");
    }

    if (parsed === undefined) {
        return true;
    }

    if (!Array.isArray(parsed)) {
        throw new Error("variants must be a valid JSON array");
    }

    parsed.forEach((variant, index) => {
        if (typeof variant !== "object" || variant === null || Array.isArray(variant)) {
            throw new Error(`variants[${index}] must be an object`);
        }

        const item = variant as Record<string, unknown>;

        for (const field of ["sku", "size", "color"] as const) {
            const fieldValue = item[field];
            if (typeof fieldValue !== "string" || fieldValue.trim() === "") {
                throw new Error(`variants[${index}].${field} is required`);
            }
        }

        const price = Number(item.price);
        if (!Number.isFinite(price) || price < 0) {
            throw new Error(`variants[${index}].price must be a non-negative number`);
        }

        if (item.stock !== undefined) {
            const stock = Number(item.stock);
            if (!Number.isFinite(stock) || stock < 0) {
                throw new Error(`variants[${index}].stock must be a non-negative number`);
            }
        }

        if (item.images !== undefined) {
            if (!Array.isArray(item.images)) {
                throw new Error(`variants[${index}].images must be an array`);
            }

            const hasInvalidImage = item.images.some(
                (image) => typeof image !== "string" && typeof image !== "number"
            );
            if (hasInvalidImage) {
                throw new Error(`variants[${index}].images must contain URLs or uploaded image indexes`);
            }
        }
    });

    return true;
}

function sanitizeVariants(value: unknown): VariantPayload[] {
    let parsed: unknown;

    try {
        parsed = parseJson(value);
    } catch {
        return [];
    }

    if (!Array.isArray(parsed)) {
        return [];
    }

    return parsed.map((variant) => {
        const item = variant as Record<string, unknown>;

        return {
            sku: String(item.sku).trim(),
            size: String(item.size).trim(),
            color: String(item.color).trim(),
            price: Number(item.price),
            stock: item.stock === undefined || item.stock === "" ? 0 : Number(item.stock),
            images: Array.isArray(item.images) ? (item.images as Array<string | number>) : []
        };
    });
}

export const validateCreateProduct = [
    validateProductImages,
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required"),
    body("slug")
        .optional({ values: "falsy" })
        .isString().withMessage("Slug must be a string")
        .trim(),
    body("description")
        .trim()
        .notEmpty().withMessage("Description is required"),
    body("category")
        .trim()
        .notEmpty().withMessage("Category is required"),
    body("basePrice")
        .notEmpty().withMessage("Base price is required")
        .isFloat({ min: 0 }).withMessage("Base price must be a non-negative number"),
    body("attributes")
        .custom(validateAttributes)
        .customSanitizer(sanitizeAttributes),
    body("variants")
        .custom(validateVariants)
        .customSanitizer(sanitizeVariants),
    body("isActive")
        .optional({ values: "falsy" })
        .isBoolean().withMessage("isActive must be a boolean value"),
    validateRequest
];
