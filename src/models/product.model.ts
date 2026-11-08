import mongoose, { Schema } from "mongoose";
import type { Types } from "mongoose";

export interface IProductVariant {
   _id?: Types.ObjectId;
   sku: string;
   size: string;
   color: string;
   price: number;
   stock: number;
   images: string[];
}

export interface IProduct {
   title: string;
   slug: string;
   description: string;
   seller: Types.ObjectId;
   category: string;
   basePrice: number;
   attributes: Map<string, string>;
   variants: IProductVariant[];
   isActive: boolean;
   isDeleted: boolean;
   createdAt?: Date;
   updatedAt?: Date;
}

const productVariantSchema = new Schema<IProductVariant>({
   sku: { type: String, required: true, unique: true, uppercase: true },
   size: { type: String, required: true, trim: true },
   color: { type: String, required: true, trim: true },
   price: { type: Number, required: true, min: 0 },
   stock: { type: Number, required: true, min: 0, default: 0 },
   images: [{ type: String }]
});

const productSchema = new Schema<IProduct>(
   {
      title: { type: String, required: true, trim: true },
      slug: { type: String, required: true, lowercase: true, index: true },
      description: { type: String, required: true },
      seller: {
         type: Schema.Types.ObjectId,
         ref: "user",
         required: true,
         index: true
      },
      category: { type: String, required: true, index: true },
      basePrice: { type: Number, required: true, min: 0 },
      attributes: {
         type: Map,
         of: String,
         default: () => new Map<string, string>()
      },
      variants: [productVariantSchema],
      isActive: { type: Boolean, default: true, index: true },
      isDeleted: { type: Boolean, default: false }
   },
   { timestamps: true }
);

// Performance Indexes
productSchema.index({ title: 'text', description: 'text' }); // For text search
productSchema.index({ category: 1, basePrice: 1 }); // For filtering and sorting

const productModel = mongoose.model("product", productSchema);

export default productModel;
