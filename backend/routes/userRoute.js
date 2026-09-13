import express from 'express'
import { deleteUser, getSingleUser, getUseList, getUserDetails, loginUSer, logout, registerUser, requestPasswordReset, resetPassword, updatePassword, updateProfile, updateUserRole } from '../controllers/userController.js';
import { roleBaseAccess, verifyUserAuth } from '../middleware/userAuth.js';


const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUSer);

router.route("/logout").post(logout);

router.route("/forgot/password").post(requestPasswordReset);

router.route("/reset/:token").put(resetPassword);

router.route("/profile").get(verifyUserAuth, getUserDetails);

router.route("/password/update").put(verifyUserAuth, updatePassword);

router.route("/profile/update").put(verifyUserAuth, updateProfile);

router.route("/admin/users").get(verifyUserAuth,  roleBaseAccess('admin'), getUseList);

router.route("/admin/user/:id").get(verifyUserAuth,  roleBaseAccess('admin'), getSingleUser)
.put(verifyUserAuth,  roleBaseAccess('admin'), updateUserRole)
.delete(verifyUserAuth,  roleBaseAccess('admin'), deleteUser);
export default router;