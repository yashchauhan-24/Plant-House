import mongoose, { Types } from "mongoose";
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "plz enter  product name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "plz enter priductdescription"],
  },
  price: {
    type: Number,
    required: true,
    maxLength: [7, "plz enter"],
  },
  originalPrice: {
    type: Number,
    required: false,
  },
  ratting: {
    type: Number,
    default: 0,
  },
  image: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: String,
    required: [true, ""],
    maxLength: [5, ""],
    default: 1,
  },
  numOfReview: {
    type: String,
    default: 0,
  },
  reviews: [
    {
      user: {
        type : mongoose.Schema.ObjectId, 
        ref : "User",
        required: true
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      }
    }
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Products", productSchema);
