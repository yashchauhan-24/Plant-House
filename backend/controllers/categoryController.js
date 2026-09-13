import handleAsyncError from "../middleware/handleAsyncError.js";
import Category from "../model/category.models.js";
import HandleErroe from "../utils/handleError.js";
import Product from "../model/product.models.js";
import { v2 as cloudinary } from "cloudinary";

const uploadCategoryImage = async (file) => {
  if (!file) return null;
  const source = file.tempFilePath || `data:${file.mimetype};base64,${file.data.toString("base64")}`;
  const result = await cloudinary.uploader.upload(source, { folder: "categories" });
  return { public_id: result.public_id, url: result.secure_url };
};

export const getAllCategories = handleAsyncError(async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });

  res.status(200).json({
    success: true,
    categories,
  });
});

export const createCategory = handleAsyncError(async (req, res, next) => {
  const name = req.body?.name?.trim();

  if (!name) {
    return next(new HandleErroe("Category name is required", 400));
  }

  const existing = await Category.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
  if (existing) {
    return next(new HandleErroe("Category already exists", 400));
  }

  const image = await uploadCategoryImage(req.files?.categoryImage);
  const category = await Category.create({ name, ...(image ? { image } : {}) });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});

export const updateCategory = handleAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const name = req.body?.name?.trim();

  if (!name) {
    return next(new HandleErroe("Category name is required", 400));
  }

  const category = await Category.findById(id);
  if (!category) {
    return next(new HandleErroe("Category not found", 404));
  }

  const existing = await Category.findOne({
    _id: { $ne: id },
    name: { $regex: `^${name}$`, $options: "i" },
  });
  if (existing) {
    return next(new HandleErroe("Another category with same name exists", 400));
  }

  category.name = name;
  const image = await uploadCategoryImage(req.files?.categoryImage);
  if (image) {
    if (category.image?.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id).catch(() => null);
    }
    category.image = image;
  }
  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category,
  });
});

export const deleteCategory = handleAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const category = await Category.findById(id);
  if (!category) {
    return next(new HandleErroe("Category not found", 404));
  }
  const linkedProducts = await Product.countDocuments({ category: category.name });
  if (linkedProducts > 0) {
    return next(new HandleErroe("Category cannot be deleted while products use it", 409));
  }
  await Category.findByIdAndDelete(id);
  if (category.image?.public_id) {
    await cloudinary.uploader.destroy(category.image.public_id).catch(() => null);
  }

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    id,
  });
});