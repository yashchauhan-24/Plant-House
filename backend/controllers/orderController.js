import handleAsyncError from "../middleware/handleAsyncError.js";
import HandleErroe from "../utils/handleError.js";
import Order from "../model/order.models.js";
import Product from "../model/product.models.js";
import User from "../model/user.models.js";
import mongoose from "mongoose";

// create Order
export const createNewOrder = handleAsyncError(async (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(
      new HandleErroe(
        "Request body is required. Send JSON with Content-Type: application/json",
        400,
      ),
    );
  }

  if (!req.user || !req.user._id) {
    console.error("❌ User not authenticated");
    return next(new HandleErroe("User authentication required", 401));
  }

  const {
    shipingInfo,
    orderItem,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  console.log("📝 Order creation request from user:", req.user._id, { 
    hasShipingInfo: !!shipingInfo, 
    hasOrderItem: !!orderItem, 
    hasPaymentInfo: !!paymentInfo,
    orderItemCount: orderItem?.length || 0
  });

  if (!shipingInfo || !orderItem || !paymentInfo) {
    console.error("❌ Missing required fields:", { hasShipingInfo: !!shipingInfo, hasOrderItem: !!orderItem, hasPaymentInfo: !!paymentInfo });
    return next(
      new HandleErroe(
        "shipingInfo, orderItem and paymentInfo are required",
        400,
      ),
    );
  }

  if (!Array.isArray(orderItem) || orderItem.length === 0) {
    console.error("❌ orderItem must be a non-empty array");
    return next(new HandleErroe("Order must contain at least one item", 400));
  }

  try {
    const newOrder = await Order.create({
      shipingInfo,
      orderItem,
      paymentInfo,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });
    console.log("✅ Order created successfully:", newOrder._id);
    res.status(201).json({
      success: true,
      newOrder,
    });
  } catch (error) {
    console.error("❌ Order creation error:", error.message, error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(e => e.message).join(", ");
      return next(new HandleErroe(`Validation Error: ${messages}`, 400));
      return next(new HandleErroe(`Validation Error: ${messages}`, 400));
    }
    throw error;
  }
});

// get single product
export const getSingleOrder = handleAsyncError(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "orderItem.product",
      strictPopulate: false,
    });
    if (!order) {
      return next(new HandleErroe("Order Not found ", 400));
    }
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
});

// All my order find
export const allMyOrder = handleAsyncError(async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return next(new HandleErroe("User authentication required", 401));
    }

    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: "orderItem.product",
        strictPopulate: false,
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders: Array.isArray(orders) ? orders : [],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
      orders: [],
    });
  }
});

// get all order
export const getAllOrders = handleAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  // find total order toal amount
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount = totalAmount + order.totalPrice;
  });
  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});

// update order status
export const updateOrderStatus = handleAsyncError(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new HandleErroe("Invalid order ID", 400));
  }
  const allowedStatuses = ["Processing", "Shipped", "On the way", "Delivered"];
  const requestedStatus = req.body?.status?.toString().trim();
  const nextStatus = allowedStatuses.find((status) => status.toLowerCase() === requestedStatus?.toLowerCase());
  if (!nextStatus) {
    return next(new HandleErroe("A valid order status is required", 400));
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new HandleErroe("Order Not found ", 400));
  }

  if (order.orderStatus === "Delivered") {
    return next(new HandleErroe("Order already delivered", 400));
  }

  const updateData = {
    orderStatus: nextStatus,
  };

  if (nextStatus === "Delivered") {
    await Promise.all(
      order.orderItem.map((item) => updateQuamtity(item.product, item.quantity)),
    );
    updateData.deliverdAt = Date.now();
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    {
      new: true,
      runValidators: false,
    },
  );

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order: updatedOrder,
  });
});

async function updateQuamtity(id, quantity) {
  const product = await Product.findById(id);
  if (!product) {
     throw new HandleErroe("No Product Found", 400);
  }

  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
}

// delete order
export const deleteOrder = handleAsyncError(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new HandleErroe("Invalid order ID", 400));
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new HandleErroe("No order Found", 400));
  }

  if (req.user.role === "admin") {
    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      id: req.params.id,
    });
  }

  // Check if user is trying to cancel their own order
  if (req.user._id.toString() === order.user.toString()) {
    // Users can only cancel if order is NOT delivered
    if (order.orderStatus === "Delivered") {
      return next(new HandleErroe("Cannot delete delivered orders", 400));
    }
    // Mark order as cancelled by user instead of deleting
    order.isCancelled = true;
    order.cancelledBy = "user";
    order.cancelledAt = Date.now();
    await order.save();
    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully"
    });
  }

  return next(new HandleErroe("Unauthorized to delete this order", 403));
});

// Confirm order cancellation (Admin only)
export const confirmOrderCancellation = handleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new HandleErroe("No order Found", 400));
  }

  if (order.orderStatus === "Delivered") {
    return next(new HandleErroe("Cannot cancel delivered orders", 400));
  }

  // Confirm the cancellation
  order.isCancelled = true;
  order.cancelledBy = "admin";
  order.cancelledAt = Date.now();
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order cancellation confirmed",
    order
  });
});
