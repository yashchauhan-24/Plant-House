import mongoose from "mongoose";

export const connectMDB = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((data) => {
      console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(`MongoDB connection error: ${err.message}`);
      console.log("Server will continue to run, but database is not connected.");
    });
};
