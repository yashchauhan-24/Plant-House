import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig.js";

export const getProduct = createAsyncThunk(
  "product/getProduct",
  async ({ keyword, page = 1, category, limit = 12 }, { rejectWithValue }) => {
    try {
      let link = `/api/v1/products?page=${page}&limit=${limit}`;
      if(category){
        link += `&category=${category}`;
      }
      if(keyword){
       link += `&keyword=${keyword}`;
      }
      /*
      const link = `/api/v1/products?keyword=${encodeURIComponent(
        keyword || "",
      )}&page=${page}`;
      */
      // api from backend same to same
      // const link = "/api/v1/products";
      const { data } = await axios.get(link);
      // console.log("responce", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An Error Occurred");
    }
  },
);
// create review
export const createReview = createAsyncThunk(
  "product/createReview",
  async ({ rating,comment,productId }, { rejectWithValue }) => {
    try {
      if (!productId) {
        return rejectWithValue({ message: "Product Id is required" });
      }

      if (!comment?.toString().trim()) {
        return rejectWithValue({ message: "Comment is required" });
      }

      const config = {
        headers:{
          'Content-Type': 'application/json'
        }
      }
      const { data } = await axios.put('/api/v1/review', {
        rating: Number(rating),
        comment: comment.toString().trim(),
        productId,
      }, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An Error Occurred");
    }
  },
);


// Product Details
export const getProductDetails = createAsyncThunk(
  "product/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const link = `/api/v1/product/${id}`;
      const { data } = await axios.get(link);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "No Product");
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    productCount: 0,
    loading: false,
    error: null,
    product: null,
    resultPerPage: 10,
    totalPages: 0,
    reviewSuccess: false,
    reviewLoading: false
  },
  // when error than call reducer error clear with reducer
  reducers: {
    removeError: (state) => {
      state.error = null;
    },
    removeSuccess:(state)=>{
      state.reviewSuccess = false
    }
  },
  extraReducers: (builder) =>
    // lifecycle action implement
    {
      builder
        .addCase(getProduct.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getProduct.fulfilled, (state, action) => {
          state.loading = false;
          state.error = null;
          state.products = action.payload.products;
          state.productCount = action.payload.productCount;
          state.totalPages = action.payload.totalPages;
          state.resultPerPage = action.payload.resultPerPage;
          // console.log("fulfilledCase", action.payload);
        })
        .addCase(getProduct.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "something went wrong";
          state.products = [];
        });

      builder
        .addCase(getProductDetails.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getProductDetails.fulfilled, (state, action) => {
          state.loading = false;
          state.error = null;
          state.product = action.payload.product;
          // console.log("productDetails", action.payload);
        })
        .addCase(getProductDetails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "something went wrong";
        });

        // createReview
      builder
        .addCase(createReview.pending, (state) => {
          state.reviewLoading = true;
          state.error = null;
        })
        .addCase(createReview.fulfilled, (state) => {
                   state.reviewLoading = false;
                   state.reviewSuccess=true

        })
        .addCase(createReview.rejected, (state, action) => {
                   state.reviewLoading = false;
          state.error = action.payload?.message || "something went wrong";
        });
    },
});

export const { removeError, removeSuccess} = productSlice.actions;
export default productSlice.reducer;
