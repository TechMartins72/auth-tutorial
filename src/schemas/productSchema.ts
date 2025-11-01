import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    bundlePrice: { type: Number, min: 0, default: 0 },
    bundleSize: { type: Number, min: 1, default: 1 },
    category: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    imageBlob: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    isPreorder: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    amountAvailable: { type: Number, required: true, min: 0, default: 0 },
    sizeType: {type: String, required: true, default: "standard"}
  },
  {
    timestamps: true,
  }
);

export const ProductModel = mongoose.model("Product", ProductSchema);
