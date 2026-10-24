import handleAsyncError from "../middleware/handleAsyncError.js";
import Category from "../model/category.models.js";
import HandleErroe from "../utils/handleError.js";
import { v2 as cloudinary } from "cloudinary";

const uploadCategoryImage = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const source =
      file.tempFilePath ||
      `data:${file.mimetype};base64,${file.data.toString("base64")}`;

    cloudinary.uploader
      .upload(source, {
        folder: "categories",
        resource_type: "image",
        transformation: [{ width: 1000, crop: "limit", quality: "auto" }],
      })
      .then((result) => {
        resolve({
          public_id: result.public_id,
          url: result.secure_url,
        });
      })
      .catch(reject);
  });

const getCategoryFiles = (file) => {
  if (!file) return [];
  return Array.isArray(file) ? file : [file];
};

const parseImage = (image) => {
  if (typeof image !== "string") return image;
  try {
    return JSON.parse(image);
  } catch (error) {
    return image;
  }
};

export const getAllCategories = handleAsyncError(async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });

  res.status(200).json({
    success: true,
    categories,
  });
});

export const createCategory = handleAsyncError(async (req, res, next) => {
  try {
    const name = req.body?.name?.trim();
    if (!name) {
      return next(new HandleErroe("Category name is required", 400));
    }

    const files = getCategoryFiles(req.files?.categoryImage);
    const uploadedImages = await Promise.all(files.map(uploadCategoryImage));
    const image = uploadedImages[0];
    const category = await Category.create({
      name,
      ...(image ? { image } : {}),
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
});

export const updateCategory = handleAsyncError(async (req, res, next) => {
  try {
    const name = req.body?.name?.trim();
    if (!name) {
      return next(new HandleErroe("Category name is required", 400));
    }

    const files = getCategoryFiles(req.files?.categoryImage);
    const uploadedImages = await Promise.all(files.map(uploadCategoryImage));
    const image = uploadedImages[0];
    const update = { name };
    if (image) update.image = image;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      update,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!category) {
      return next(new HandleErroe("Category not found", 404));
    }

    if (image && req.body.oldImage) {
      const oldImage = parseImage(req.body.oldImage);
      if (oldImage?.public_id) {
        Promise.resolve(
          cloudinary.uploader.destroy(oldImage.public_id),
        ).catch(() => null);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
});

export const deleteCategory = handleAsyncError(async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return next(new HandleErroe("Category not found", 404));
    }

    if (category.image?.public_id) {
      Promise.resolve(
        cloudinary.uploader.destroy(category.image.public_id),
      ).catch(() => null);
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
});
