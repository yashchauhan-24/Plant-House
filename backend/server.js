import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectMDB } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import errorHandleMiddleware from "./middleware/error.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import order from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import Razorpay from "razorpay";

dotenv.config({ path: "./config/config.env" });

connectMDB();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

process.on("uncaughtException", (err) => {
  console.log(`Erro: ${err.message}`);

  console.log("Server is shutting down due to unhandled exception error");
  process.exit(1);
});

const app = express();
const port = process.env.PORT || 8182;

// Instantce of Razorpay
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// CORS Configuration - Allow frontend to communicate with backend
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-role"],
}));

// Middleware to read JSON
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(fileUpload());
app.use("/api/v1", (req, res, next) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
    Pragma: "no-cache",
    Expires: "0",
  });
  next();
});

// Routes
app.use("/api/v1", productRoutes);
// user Route
app.use("/api/v1", userRoute);
// oreder
app.use("/api/v1", order);
// payment
app.use("/api/v1", paymentRoutes);
// category
app.use("/api/v1", categoryRoutes);

// Error Middleware (Always after routes)
app.use(errorHandleMiddleware);

// Store server in variable
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// console.log(mName);

//  Correct Unhandled Promise Rejection Handler
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(
    "Server is shutting down due to unhandled exception error",
    err.message,
  );

  server.close(() => {
    process.exit(1);
  });
});
