import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../utils/axiosConfig'
// create Order
export const createOder = createAsyncThunk("order/createOrder", async (order, {rejectWithValue}) => {
    try {
        console.log("📝 Sending order to backend:", order);
        const config = {
            headers :{
                'Content-Type' : 'application/json'
            }
        } 
        const {data}   = await axios.post('/api/v1/new/order', order, config)
        console.log("✅ Order created successfully:", data);
        return data
    } catch (error) {
        console.error("❌ Order creation failed:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || {message: "Failed to create order"});
    }
});
// Get All orders
export const getMyAllOrders = createAsyncThunk("order/getMyAllOrders", async (_, {rejectWithValue}) => {
    try {
        const {data}   = await axios.get('/api/v1/orders/user')
        return data
    } catch (error) {
        console.error("Fetching my orders failed:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || {message: error.message});
    }
});
// Get All orders details
export const getOrderDetails = createAsyncThunk("order/getOrderDetails", async (orderId, {rejectWithValue}) => {
    try {
        const {data}   = await axios.get(`/api/v1/order/${orderId}`)
        return data
    } catch (error) {
        console.error("failed to fetch oder details:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || {message: error.message});
    }
});

// Delete Order
export const deleteUserOrder = createAsyncThunk("order/deleteUserOrder", async (orderId, {rejectWithValue}) => {
    try {
        const {data} = await axios.delete(`/api/v1/order/${orderId}/delete`)
        return data
    } catch (error) {
        console.error("Delete order failed:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || {message: error.message});
    }
});

const orderSlice = createSlice({
    name : "order",
    initialState: {
        loading: false,
        error : null,
        success : false,
        order :{},
        orders: []
    },
    reducers: {
        removeError: (state)=> {
            state.error = null;
        },
        removeSuccess: (state)=> {
            state.success = false;
        },
    },
    extraReducers:(builder)=>{
        // create order
        builder
        .addCase(createOder.pending,(state)=>{
            state.loading = true,
            state.error = null;
        })
        .addCase(createOder.fulfilled,(state, action)=>{
            state.loading = false;
            state.success = action.payload.success;
            state.order = action.payload.newOrder;
        })
        .addCase(createOder.rejected,(state, action)=>{
            state.loading = false,
            state.error = action.payload?.message || "Failed to create order"
        })
        // fetch all  order
        builder
        .addCase(getMyAllOrders.pending,(state)=>{
            state.loading = true,
            state.error = null;
        })
        .addCase(getMyAllOrders.fulfilled,(state, action)=>{
            state.loading = false;
             state.orders = action.payload.orders;
        })
        .addCase(getMyAllOrders.rejected,(state, action)=>{
            state.loading = false,
            state.error = action.payload?.message || "Failed to fetch all orders"
        })
        // getOrderDetails
        builder
        .addCase(getOrderDetails.pending,(state)=>{
            state.loading = true;
            state.error = null;
            state.order = {};
        })
        .addCase(getOrderDetails.fulfilled,(state, action)=>{
            state.loading = false;
            state.order = action.payload.order;
            state.error = null;
        })
        .addCase(getOrderDetails.rejected,(state, action)=>{
            state.loading = false;
            state.order = {};
            state.error = action.payload?.message || action.payload || "failed to fetch order details";
        })
        // deleteUserOrder
        builder
        .addCase(deleteUserOrder.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteUserOrder.fulfilled,(state, action)=>{
            state.loading = false;
            state.success = true;
            state.error = null;
        })
        .addCase(deleteUserOrder.rejected,(state, action)=>{
            state.loading = false;
            state.error = action.payload?.message || action.payload || "failed to delete order";
        })
    } 
})
export const { removeError, removeSuccess}=orderSlice.actions;
export default orderSlice.reducer