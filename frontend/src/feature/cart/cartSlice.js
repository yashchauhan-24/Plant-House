import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";
import { runPlantHouseCartWishlistMigration } from "../../utils/plantHouseCartWishlistMigration.js";

runPlantHouseCartWishlistMigration();

const readStoredArray = (key) => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const readStoredObject = (key) => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
        return {};
    }
};

// Add to cart
export const addItemsToCart = createAsyncThunk("cart/addItemsToCart", async ({id,quantity}, {rejectWithValue}) => {
    try {
        const {data} = await axios.get(`/api/v1/product/${id}`)
        const image = data?.product?.image?.[0]?.url || "/images/no-products.png"
        return {
            product : data?.product?._id,
            name: data?.product?.name,
            price: data?.product?.price,
            image,
            stock: Number(data?.product?.stock || 0),
            quantity
        }
    } catch (error) {
        return rejectWithValue(error.response?.data || "An error occured");
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: readStoredArray('cartItem'),
        loading : false,
        error: null,
        success : false,
        message: null,
        removingId:null,
        shippingInfo: readStoredObject('shippingInfo')
    },
    reducers: { 
        removeError:(state)=>{
            state.error = null
        },
        removeMessage :(state)=>{
            state.message=null
            state.success = false
        },
        removeItemFromCart: (state, action)=>{
            state.removingId = action.payload
            state.cartItems = state.cartItems.filter((item)=>item.product !== action.payload)
            state.message = 'Item removed from cart successfully'
            state.success = true
            localStorage.setItem('cartItem',JSON.stringify(state.cartItems))
            state.removingId = null
        },
        saveShippingInfo:(state,action)=>{
            state.shippingInfo = action.payload
            localStorage.setItem('shippingInfo', JSON.stringify(state.shippingInfo))
        },
        clearCart: (state)=>{
            state.cartItems= [],
            localStorage.removeItem('cartItem')
            localStorage.removeItem('shippingInfo')
        }
    },
    extraReducers:(builder)=>{
        // Add iteam to cart
        builder
        .addCase(addItemsToCart.pending,(state)=>{
            state.loading =true;
            state.error = null;
            state.success = false;
        }) 
        .addCase(addItemsToCart.fulfilled,(state, action)=>{
            const item = action.payload
            const existingItem = state.cartItems.find((i)=>i.product === item.product)
            if(existingItem){
                existingItem.quantity = item.quantity;
                state.message=`Updated ${item.name} quantity to cart successfully`
            }else{
                state.cartItems.push(item)
                state.message=`${item.name} added to cart successfully`
            }
            state.loading=false
            state.success = true;
            // store in local storege 
            localStorage.setItem('cartItem',JSON.stringify(state.cartItems))
        }) 
        .addCase(addItemsToCart.rejected,(state, action)=>{
            state.loading = false;
            state.success = false;
            state.error = action.payload?.message || " An error occured"
        }) 
    }
})
 
export const { removeError, removeMessage, removeItemFromCart, saveShippingInfo, clearCart}= cartSlice.actions
export default cartSlice.reducer