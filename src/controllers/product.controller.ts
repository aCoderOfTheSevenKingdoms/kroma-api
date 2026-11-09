import type { Request, Response } from "express";
import productModel, { type IProductVariant } from "../models/product.model.js";
import { uploadBuffer } from "../services/storage.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import type { CreateProductBody, VariantPayload } from "../validator/product.validator.js";

function toSlug(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function mapVariantImages(variant: VariantPayload, uploadedUrls: string[]): IProductVariant {
    const images = Array.isArray(variant.images) ? variant.images : [];

    return {
        ...variant,
        images: images
            .map((image) => (typeof image === "number" ? uploadedUrls[image] : image))
            .filter((image): image is string => typeof image === "string" && image.length > 0)
    };
}

export async function createProduct(req: Request, res: Response) {
    try {
        const { userId } = req as AuthenticatedRequest;
        const body = req.body as CreateProductBody;
        const files = (req.files as Express.Multer.File[] | undefined) ?? [];

        const attributes = body.attributes;
        const variants = body.variants;
        const slug = body.slug?.trim() ? body.slug : toSlug(body.title);

        const uploads = await Promise.all(
            files.map((file) =>
                uploadBuffer({
                    buffer: file.buffer,
                    fileName: file.originalname,
                    folder: "/products",
                    mimeType: file.mimetype
                })
            )
        );

        const uploadedUrls = uploads
            .map((upload) => upload.url)
            .filter((url): url is string => typeof url === "string" && url.length > 0);

        const product = await productModel.create({
            title: body.title,
            slug,
            description: body.description,
            seller: userId,
            category: body.category,
            basePrice: Number(body.basePrice),
            attributes,
            variants: variants.map((variant) => mapVariantImages(variant, uploadedUrls)),
            isActive: body.isActive === undefined ? true : body.isActive !== "false"
        });

        return res.status(201).json({
            message: "Product created successfully",
            product
        });
    } catch (error: unknown) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code?: number }).code === 11000
        ) {
            return res.status(409).json({ error: "A product with the same slug or SKU already exists" });
        }

        if (error instanceof Error && error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }

        console.error("Create product error:", error);
        return res.status(500).json({ error: "Something went wrong while creating the product" });
    }
}

export async function getProductsForSeller(req: Request, res: Response) {
    try {
        const {userId} = req as AuthenticatedRequest;
        const products = await productModel.find({seller: userId});  
        res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        }) 
    } catch(error) {
        console.error("Fetch products error", error);
        return res.status(500).json({error: "Something went wrong while fetching products"});
    }
} 