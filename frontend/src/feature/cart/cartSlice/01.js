import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { stat } from "fs";

// Add to cart
export const addItemsToCart = createAsyncThunk("cart/addItemsToCart", async ({id,quantity}, {rejectWithValue}) => {
    try {
        const {data} = await axios.get(`/api/v1/product/:${id}`)
        console.log("return data". data);
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "en error occuered");
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
        loading : false,
        error: null,
        success : false,
        message: null
    },
    reducers: {
        removeError:(state)=>{
            state.error = null
        },
        removeMessage :(state)=>{
            state.message=null
        }
    },
    extraReducers:(builder)=>{
        // Add iteam to cart
        builder
        .addCase(addItemsToCart.pending,(state)=>{
            state.loading =true;
            state.error = null;
        }) 
        .addCase(addItemsToCart.fulfilled,(state)=>{
            const item = action.payload
            console.log("Iteam", item);
            
        }) 
        .addCase(addItemsToCart.rejected,(state)=>{
            state.loading = false;
            state.error = action.payload?.message || " An error occured"
        }) 
    }
})
 
export const { removeError, removeMessage}= cartSlice.actions
export default cartSlice.reducer