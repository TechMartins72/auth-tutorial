import type { NextFunction, Request, Response } from "express";
import { ProductModel } from "../schemas/productSchema";
import { IProduct } from "../utils/types.ts";

// ONLY ADMIN ROUTES
export const postProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: IProduct = req.body;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ message: "Product details not provided" });
    }

    const product = new ProductModel(body);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const result = await ProductModel.deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cat = req.query.category as string;
    const search = req.query.search as string;

    let query = {};

    if (cat && cat.toUpperCase() !== "ALL PRODUCTS") {
      query = { category: cat.toUpperCase() };
    } else if (search) {
      const searchRegex = new RegExp(search, "i");
      query = {
        $or: [
          { name: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { category: { $regex: searchRegex } },
        ],
      };
    }

    const products = await ProductModel.find(query).maxTimeMS(10000).lean();

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
