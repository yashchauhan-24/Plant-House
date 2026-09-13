import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    image: {
      public_id: { type: String, default: "" },
      url: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Category", categorySchema);