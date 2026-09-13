import express from "express";
import product from "./routes/productRoutes.js";
import errorHandleMiddleware from './middleware/error.js'
import user from './routes/userRoute.js'
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import order from './routes/orderRoutes.js'
import dotenv from "dotenv";
import payment from './routes/paymentRoutes.js'
import category from "./routes/categoryRoutes.js";
// import authRoutes from "./routes/userRoute.js"
const app = express();

// IMPORTANT: parse JSON middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
// cookie parser
app.use(cookieParser()); 
// fileupload
app.use(fileUpload())
// payment
app.use(express.urlencoded({extended:true}))

// mount routes product route
app.use("/api/v1", product);

// user route
app.use("/api/v1", user);

// order route
app.use("/api/v1", order);

// payment route
app.use("/api/v1", payment);

// category route
app.use("/api/v1", category);

// auth route
// app.use("/api/v1", authRoutes);


app.use(errorHandleMiddleware)

dotenv.config({path:'backend/config/config.env'})

export default app;