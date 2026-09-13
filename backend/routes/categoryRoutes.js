import express from "express";
import { createCategory, getAllCategories, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { roleBaseAccess, verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.route("/categories").get(getAllCategories);
router
  .route("/admin/category")
  .post(verifyUserAuth, roleBaseAccess("admin"), createCategory);

router
  .route("/admin/category/:id")
  .put(verifyUserAuth, roleBaseAccess("admin"), updateCategory)
  .delete(verifyUserAuth, roleBaseAccess("admin"), deleteCategory);

export default router;