import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";

// Admin fetch akll products
export const fetchAllProducts = createAsyncThunk(
  "admin/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/admin/products");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed TO  fetch Products",
      );
    }
  },
);

// create productrs
export const createProducts = createAsyncThunk(
  "admin/createProducts",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "/api/v1/admin/dashboard/create",
        productData,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed To Craete Products",
      );
    }
  },
);

export const fetchCategories = createAsyncThunk(
  "admin/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/categories");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch categories");
    }
  },
);

export const createCategory = createAsyncThunk(
  "admin/createCategory",
  async ({ name, image }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("categoryImage", image);
      const { data } = await axios.post("/api/v1/admin/category", formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create category");
    }
  },
);

export const updateCategory = createAsyncThunk(
  "admin/updateCategory",
  async ({ id, name, image, oldImage }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("categoryImage", image);
      if (oldImage) formData.append("oldImage", JSON.stringify(oldImage));
      const { data } = await axios.put(`/api/v1/admin/category/${id}`, formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update category");
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "admin/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/category/${id}`);
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete category");
    }
  },
);

// update Product
export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `/api/v1/admin/product/${id}`,
        formData,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed To  Update Products",
      );
    }
  },
);
// delete Product
export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/product/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed To delete Products",
      );
    }
  },
);
// Fetch All User
export const fetchUser = createAsyncThunk(
  "admin/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/admin/users`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To fetch users ");
    }
  },
);
// getSingleUser for edit user
export const getSingleUser = createAsyncThunk(
  "admin/getSingleUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/admin/user/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed To fetch single users ",
      );
    }
  },
);
// update user role
export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/v1/admin/user/${userId}`, {
        role,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed To update single users ",
      );
    }
  },
);
// update user role
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/user/${userId}`);
      return { ...data, userId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed To delete single users ",
      );
    }
  },
);
// fetch all orders
export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/admin/orders/");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To fetch order ");
    }
  },
);

// confirm order cancellation
export const confirmOrderCancellation = createAsyncThunk(
  "admin/confirmOrderCancellation",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/v1/admin/order/${orderId}/confirm-cancel`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to confirm cancellation");
    }
  },
);

// delete order
export const deleteOrder = createAsyncThunk(
  "admin/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/order/${id}`);
      return { ...data, id };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To update order status");
    }
  },
);
// update order
export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ orderId, id, status }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const targetId = orderId || id;
      const { data } = await axios.put(`/api/v1/admin/order/${targetId}`, { status }, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To delete order ");
    }
  },
);

// fetch reviwe
export const fetchProductReview = createAsyncThunk(
  "admin/fetchProductReview",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/admin/reviews?id=${productId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To fetch productreview");
    }
  },
);
// delete  reviwe by admin
export const deleteReview = createAsyncThunk(
  "admin/deleteReview",
  async ({productId, reviewId}, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/reviews?productId=${productId}&reviewId=${reviewId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To delete product review");
    }
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    loading: false,
    success: false,
    error: null,
    product: {},
    deleting: {},
    users: [],
    user: {},
    message: null,
    orders: [],
    totalAmount: 0,
    order:{},
    reviews: [],
    categories: [],
    categoryLoading: false,
    categoryCreateLoading: false,
    categoryCreated: false,
  },
  reducers: {
    removeError: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearCategoryCreated: (state) => {
      state.categoryCreated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        ((state.loading = false),
          (state.error =
            action.payload?.message || "Failed To fetch Products"));
      });

    // create product
    builder
      .addCase(createProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.success;
        state.products.push(action.payload.product);
      })
      .addCase(createProducts.rejected, (state, action) => {
        ((state.loading = false),
          (state.error =
            action.payload?.message || "Failed TO  Craete Products"));
      });

    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoryLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.categories = action.payload.categories || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoryLoading = false;
        state.error = action.payload?.message || "Failed to fetch categories";
      });

    builder
      .addCase(createCategory.pending, (state) => {
        state.categoryCreateLoading = true;
        state.error = null;
        state.categoryCreated = false;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categoryCreateLoading = false;
        state.categoryCreated = true;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.categories.push(action.payload.category);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.categoryCreateLoading = false;
        state.categoryCreated = false;
        state.error = action.payload?.message || "Failed to create category";
      });

    builder
      .addCase(updateCategory.pending, (state) => {
        state.categoryLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        const updated = action.payload.category;
        if (updated) {
          state.categories = state.categories.map((c) => (c._id === updated._id ? updated : c));
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.categoryLoading = false;
        state.error = action.payload?.message || "Failed to update category";
      });

    builder
      .addCase(deleteCategory.pending, (state) => {
        state.categoryLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        const id = action.payload.id;
        if (id) {
          state.categories = state.categories.filter((c) => c._id !== id);
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.categoryLoading = false;
        state.error = action.payload?.message || "Failed to delete category";
      });
    // update product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.product = action.payload.product;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        ((state.loading = false),
          (state.error =
            action.payload?.message || "Failed To update Products"));
      });
    // delete product
    builder
      .addCase(deleteProduct.pending, (state, action) => {
        const productId = action.meta?.arg;
        if (productId) {
          state.deleting[productId] = true;
        }
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const productId = action.payload;
        if (productId) {
          state.deleting[productId] = false;
        }
        state.products = state.products.filter(
          (product) => product._id !== productId,
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        const productId = action.meta?.arg;
        if (productId) {
          state.deleting[productId] = false;
        }
        state.error = action.payload?.message || "Failed To delete Products";
      });
    // fetch User
    builder
      .addCase(fetchUser.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch users";
      });
    // single user fetch User
    builder
      .addCase(getSingleUser.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch single users";
      });
    // single user fetch User
    builder
      .addCase(updateUserRole.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Failed to update single users role";
      });
    // delete user  User
    builder
      .addCase(deleteUser.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.users = state.users.filter(
          (user) => user._id !== action.payload.userId,
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to delete single users role";
      });
    // fetch order
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.totalAmount = action.payload.totalAmount;
        state.orders = action.payload.orders;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch order";
      });
    // confirm order cancellation
    builder
      .addCase(confirmOrderCancellation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmOrderCancellation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(confirmOrderCancellation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to confirm cancellation";
      });
    // deleteOrder order
    builder
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.orders = state.orders.filter((order) => order._id !== action.payload.id);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete order";
      });
    // update  order state
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.order = action.payload.order;
        state.orders = state.orders.map((order) =>
          order._id === action.payload.order?._id ? action.payload.order : order,
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update  order status";
      });
    // update  order state
    builder
      .addCase(fetchProductReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.reviews = [];
      })
      .addCase(fetchProductReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews || [];
      })
      .addCase(fetchProductReview.rejected, (state, action) => {
        state.loading = false;
        state.reviews = [];
        state.error = action.payload?.message || "Failed to fetch product review";
      });
    // delete review
    builder
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.reviews = [];
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to product review";
      });
  },
});

export const { removeError, removeSuccess, clearMessage, clearCategoryCreated } = adminSlice.actions;
export default adminSlice.reducer;
