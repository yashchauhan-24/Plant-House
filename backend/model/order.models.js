import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  shipingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
  },
  orderItem: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        default: "",
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Products",
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    required : true
  },
  itemPrice :{
    type: Number, 
     required : true,
     default : 0
  },
  taxPrice : {
    type: Number, 
     required : true,
     default : 0
  },
  shippingPrice : {
    type: Number, 
     required : true,
     default : 0
  },
  totalPrice : {
    type: Number, 
     required : true,
     default : 0
  },
  orderStatus :{
    type: String, 
     required : true,
     default : "Processing",
  },
  deliverdAt :Date,
  isCancelled: {
    type: Boolean,
    default: false,
  },
  cancelledBy: {
    type: String,
    enum: ["user", "admin"],
    default: null,
  },
  cancelledAt: Date,
  createdAt :{
    type: Date,
    default: Date.now
  }
});
export default mongoose.model("Order", orderSchema)