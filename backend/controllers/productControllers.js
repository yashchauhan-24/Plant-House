import handleAsyncError from "../middleware/handleAsyncError.js";
import Product from "../model/product.models.js";
import User from "../model/user.models.js";
import ApiFunctionality from "../utils/apiFunctioanality.js";
import HandleErroe from "../utils/handleError.js";
import { v2 as cloudinary } from "cloudinary";

const uploadProductImage = async (file) => {
  const source =
    file.tempFilePath ||
    `data:${file.mimetype};base64,${file.data.toString("base64")}`;
  const result = await cloudinary.uploader.upload(source, {
    folder: "plant_house",
    resource_type: "image",
  });

  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
};

/*
|--------------------------------------------------------------------------
| CREATE PRODUCT
|--------------------------------------------------------------------------
*/

export const createProduct = handleAsyncError(async (req, res, next) => {
  try {
    const files = req.files?.image
      ? Array.isArray(req.files.image)
      ? req.files.image
      : [req.files.image]
      : [];

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    const imageLinks = await Promise.all(files.map(uploadProductImage));

    const product = await Product.create({
      ...req.body,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      image: imageLinks,
      user: req.user?.id,
    });

    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
});


/*
|--------------------------------------------------------------------------
| GET ALL PRODUCTS
|--------------------------------------------------------------------------
*/

export const getAllProduct = handleAsyncError(async (req, res, next) => {
  const requestedLimit = Number(req.query.limit);
  const resultPerPage = Number.isFinite(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, 50)
    : 12;

  // Search and filter
  const apiFeature = new ApiFunctionality(
    Product.find(),
    req.query
  )
    .search()
    .filter();

  // Count filtered products
  const filterQuery = apiFeature.query.clone();

  const productCount = await filterQuery.countDocuments();

  const totalPages = Math.ceil(productCount / resultPerPage);

  const page = Number(req.query.page) || 1;

  // Invalid page
  if (page > totalPages && productCount > 0) {
    return next(
      new HandleErroe("This page does not exist", 404)
    );
  }

  // Pagination
  apiFeature.pagination(resultPerPage);

  // Get products
  const products = await apiFeature.query;

  // No products
  if (!products || products.length === 0) {
    return next(
      new HandleErroe("No Product Found", 404)
    );
  }

  res.status(200).json({
    success: true,
    products,
    productCount,
    totalPages,
    currentPage: page,
    resultPerPage,
  });
});


/*
|--------------------------------------------------------------------------
| UPDATE PRODUCT
|--------------------------------------------------------------------------
*/

export const updateProduct = handleAsyncError(
  async (req, res, next) => {
    try {
      const files = req.files?.image
        ? Array.isArray(req.files.image)
          ? req.files.image
          : [req.files.image]
        : [];
      const rawOldImages = req.body.oldImages
        ? Array.isArray(req.body.oldImages)
          ? req.body.oldImages
          : [req.body.oldImages]
        : [];
      const oldImages = rawOldImages.map((image) => {
        if (typeof image !== "string") return image;
        try {
          return JSON.parse(image);
        } catch (error) {
          return image;
        }
      });

      if (files.length === 0 && oldImages.length === 0) {
        return next(
          new HandleErroe("At least one product image is required", 400),
        );
      }

      const image = files.length > 0
        ? await Promise.all(files.map(uploadProductImage))
        : oldImages;
      const productData = {
        ...req.body,
        price: Number(req.body.price),
        stock: Number(req.body.stock),
        image,
      };
      delete productData.oldImages;

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        productData,
        {
          new: true,
          runValidators: true,
        },
      );

      if (!product) {
        return next(new HandleErroe("Product Not Found", 404));
      }

      if (files.length > 0) {
        Promise.all(
          oldImages
            .filter((oldImage) => oldImage?.public_id)
            .map((oldImage) =>
              cloudinary.uploader.destroy(oldImage.public_id).catch(() => null),
            ),
        ).catch(() => null);
      }

      return res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error?.message || "Internal Server Error",
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| DELETE PRODUCT
|--------------------------------------------------------------------------
*/

export const deleteProduct = handleAsyncError(
  async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    // Product not found
    if (!product) {
      return next(
        new HandleErroe("Product Not Found", 404)
      );
    }

    // Delete product images from Cloudinary
    if (product.image && product.image.length > 0) {
      for (let i = 0; i < product.image.length; i++) {
        if (product.image[i].public_id) {
          await cloudinary.uploader.destroy(
            product.image[i].public_id
          );
        }
      }
    }

    // Delete product
    product = await Product.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  }
);


/*
|--------------------------------------------------------------------------
| GET SINGLE PRODUCT DETAILS
|--------------------------------------------------------------------------
*/

export const getProductDetails = handleAsyncError(
  async (req, res, next) => {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return next(
        new HandleErroe("Product Not Found", 404)
      );
    }

    res.status(200).json({
      success: true,
      product,
    });
  }
);


/*
|--------------------------------------------------------------------------
| CREATE / UPDATE PRODUCT REVIEW
|--------------------------------------------------------------------------
*/

export const createReviewForProducts = handleAsyncError(
  async (req, res, next) => {
    const {
      rating,
      comment,
      productId,
    } = req.body;

    // Product ID required
    if (!productId) {
      return next(
        new HandleErroe(
          "Product Id is required",
          400
        )
      );
    }

    // Rating required
    if (rating === undefined) {
      return next(
        new HandleErroe(
          "Rating is required",
          400
        )
      );
    }

    // Convert rating to number
    const numericRating = Number(rating);

    // Validate rating
    if (
      Number.isNaN(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return next(
        new HandleErroe(
          "Rating must be a number between 1 and 5",
          400
        )
      );
    }

    // Review object
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: numericRating,
      comment,
    };

    // Find product
    const product = await Product.findById(
      productId
    );

    if (!product) {
      return next(
        new HandleErroe(
          "No product Found",
          404
        )
      );
    }

    // Check existing review
    const reviewExists = product.reviews.find(
      (review) =>
        review.user.toString() ===
        req.user._id.toString()
    );

    if (reviewExists) {
      // Update existing review
      product.reviews.forEach((review) => {
        if (
          review.user.toString() ===
          req.user._id.toString()
        ) {
          review.rating = numericRating;
          review.comment = comment;
        }
      });
    } else {
      // Add new review
      product.reviews.push(review);
    }

    // Number of reviews
    product.numOfReview =
      product.reviews.length;

    // Calculate average rating
    const sum = product.reviews.reduce(
      (acc, item) =>
        acc + Number(item.rating),
      0
    );

    product.ratting =
      product.reviews.length
        ? sum / product.reviews.length
        : 0;

    // Save
    await product.save({
      validateBeforeSave: false,
    });

    res.status(200).json({
      success: true,
      product,
    });
  }
);


/*
|--------------------------------------------------------------------------
| GET PRODUCT REVIEWS
|--------------------------------------------------------------------------
*/

export const getProductReviews = handleAsyncError(
  async (req, res, next) => {
    const productId =
      req.query.productId ||
      req.query.id;

    if (!productId) {
      return next(
        new HandleErroe(
          "Product Id is required",
          400
        )
      );
    }

    const product = await Product.findById(
      productId
    );

    if (!product) {
      return next(
        new HandleErroe(
          "No Product Found",
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  }
);


/*
|--------------------------------------------------------------------------
| DELETE PRODUCT REVIEW
|--------------------------------------------------------------------------
*/

export const deleteProductReview = handleAsyncError(
  async (req, res, next) => {
    const productId =
      req.query.productId;

    const reviewId =
      req.query.reviewId ||
      req.query.id;

    // IDs required
    if (!productId || !reviewId) {
      return next(
        new HandleErroe(
          "Product Id and Review Id are required",
          400
        )
      );
    }

    // Find product
    const product = await Product.findById(
      productId
    );

    if (!product) {
      return next(
        new HandleErroe(
          "No Product Found",
          404
        )
      );
    }

    // Remove review
    const reviews =
      product.reviews.filter(
        (review) =>
          review._id.toString() !==
          reviewId.toString()
      );

    // Review not found
    if (
      reviews.length ===
      product.reviews.length
    ) {
      return next(
        new HandleErroe(
          "Review Not Found",
          404
        )
      );
    }

    // Number of reviews
    const numOfReview =
      reviews.length;

    // Calculate rating
    const ratting = numOfReview
      ? reviews.reduce(
          (acc, item) =>
            acc + Number(item.rating),
          0
        ) / numOfReview
      : 0;

    // Update product
    await Product.findByIdAndUpdate(
      productId,
      {
        reviews,
        numOfReview,
        ratting,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message:
        "Review Deleted Successfully",
    });
  }
);


/*
|--------------------------------------------------------------------------
| ADMIN - GET ALL PRODUCTS
|--------------------------------------------------------------------------
*/

export const getAdminProducts = handleAsyncError(
  async (req, res, next) => {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return next(
        new HandleErroe(
          "No Product Found",
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      products,
    });
  }
);