import express from "express";
import { allMyOrder, createNewOrder, deleteOrder, getAllOrders, getSingleOrder, updateOrderStatus, confirmOrderCancellation } from "../controllers/orderController.js";
import { roleBaseAccess, verifyUserAuth } from "../middleware/userAuth.js";
const router = express.Router();


router.route("/new/order").post( verifyUserAuth,createNewOrder)
router.route("/order/:id").get(verifyUserAuth,getSingleOrder)

router.route('/admin/order/:id')
.put(verifyUserAuth,roleBaseAccess("admin"),updateOrderStatus)
.delete(verifyUserAuth,roleBaseAccess("admin"),deleteOrder)

router
.route("/admin/orders")
.get( verifyUserAuth,roleBaseAccess("admin"),getAllOrders)

// User delete their own order if not delivered
router.route("/order/:id/delete").delete(verifyUserAuth, deleteOrder)

// Admin confirm order cancellation
router.route("/admin/order/:id/confirm-cancel").put(verifyUserAuth, roleBaseAccess("admin"), confirmOrderCancellation)

router
.route("/orders/user").get( verifyUserAuth, allMyOrder)


export default router;