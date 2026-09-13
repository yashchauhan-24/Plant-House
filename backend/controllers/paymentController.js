import handleAsyncError from "../middleware/handleAsyncError.js";
import { instance } from "../server.js";
import HandleErroe from "../utils/handleError.js";
import crypto from "crypto";
export const processPayment = handleAsyncError(async (req, res) => {
  const rawAmount = Number(req.body?.amount);

  if (!Number.isFinite(rawAmount) || rawAmount <= 0) {
    throw new HandleErroe("Invalid payment amount", 400);
  }

  const amountInPaise = Math.round(rawAmount * 100);

  if (!Number.isInteger(amountInPaise) || amountInPaise <= 0) {
    throw new HandleErroe("Invalid payment amount format", 400);
  }

  const options = {
    amount: amountInPaise,
    currency: "INR",
  };

  const order = await instance.orders.create(options);
  res.status(200).json({
    success: true,
    order,
  });
});

// send api key
export const sendApiKey = handleAsyncError(async (req, res) => {
  res.status(200).json({
    key: process.env.RAZORPAY_API_KEY,
  });
});

// Payment verification

export const paymentVerification = handleAsyncError(async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");
  const isAuthentic = expectedSignature === razorpay_signature;
  if (isAuthentic) {
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      reference: razorpay_payment_id,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  }
});
