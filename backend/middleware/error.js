// // middleware for error
// export  default (err, req, res, next)=>{

//     err.statusCode = err.statusCode || 500;
//     err.message = err.message || "Internal Server Error"

//     res.status(err.statusCode).json({
//         success :false,
//         message:  err.message
//     })
// }
import HandleError from "../utils/handleError.js";

const errorHandleMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");

    err = new HandleError(message, 400);
  }

  // Cast Error (Invalid Mongo ID)
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`;
    err = new HandleError(message, 400);
  }

  // Duplicate Email Error
  if (err.code === 11000) {
    const message = `This ${Object.keys(err.keyValue)} already registered`;
    err = new HandleError(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorHandleMiddleware;