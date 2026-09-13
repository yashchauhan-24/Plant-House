import handleAsyncError from "./handleAsyncError.js";
import HandleErroe from "../utils/handleError.js";
import jwt from "jsonwebtoken";
import User from '../model/user.models.js'


export const verifyUserAuth = handleAsyncError(async (req, res, next) => {
  // Prefer Authorization header token for role-scoped sessions, fallback to cookie.
  let token = null;

  if (req.headers.authorization) {
    token = req.headers.authorization.replace("Bearer ", "");
  }

  if (!token) {
    token = req.cookies.token;
  }
  
  if (!token) {
    console.error("❌ No authentication token found in cookies or headers");
    return next(new HandleErroe("authentication missing plz login first", 400));
  }

  try {
    console.log("🔐 Verifying token...");
    const decodeData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("✅ Token verified for user:", decodeData.id);
    req.user = await User.findById(decodeData.id);

    if (!req.user) {
      console.error("❌ User not found for decoded id:", decodeData.id);
      return next(new HandleErroe("User no longer exists, please login again", 401));
    }

    console.log("✅ User authenticated:", req.user._id);
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});

export const roleBaseAccess = (...roles) => {
    return (req, res, next) => {
    if(!req.user){
      return next(new HandleErroe("Unauthorized access", 401))
    }

    if(!roles.includes(req.user.role)){
      return next(new HandleErroe(`Role ${req.user.role} is not allowed to  access the resourse`, 403))
        }
        next();
    }
}
// roleBaseAccess("admin", "superadmin")