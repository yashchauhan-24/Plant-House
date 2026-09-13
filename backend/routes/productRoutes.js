// import express from "express"
// import { createProduct, getProduct, getSingleProduct } from "../controllers/productControllers.js";

// const router = express.Router();
// router.route("/products").get(getProduct).post(createProduct)
// // app.route("/products").get(getSingleProduct)

// export default router;

import express from "express";
import { createProduct,deleteProduct,getProductDetails,getAllProduct,updateProduct,
  getAdminProducts,createReviewForProducts,
  getProductReviews,
  deleteProductReview,} from "../controllers/productControllers.js";
import { roleBaseAccess, verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();

router
  .route("/products").get(getAllProduct)
router.route("/review").put( verifyUserAuth,createReviewForProducts);
router.route("/admin/reviews").get(getProductReviews).delete(deleteProductReview);

  // admin routes
router.route("/admin/products") 
  .get(verifyUserAuth, roleBaseAccess('admin'), getAdminProducts);

router.route("/admin/dashboard/create")
  .post(verifyUserAuth,roleBaseAccess('admin'), createProduct);
// router.route("/products/:id")
//   .get(getSingleProduct);

router
  .route("/admin/product/:id")
    .put(verifyUserAuth, roleBaseAccess
      ('admin'),updateProduct)
    .delete(verifyUserAuth, roleBaseAccess
      ('admin'),deleteProduct)
      
router
.route("/product/:id").get( getProductDetails);

export default router;
