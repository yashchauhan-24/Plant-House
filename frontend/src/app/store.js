import { configureStore } from "@reduxjs/toolkit";
import productReducer from '../feature/product/productSllice.js'
import  useReducer  from "../feature/user/userSlice.js";
import cartReducer from '../feature/cart/cartSlice.js'
import orderReducer from '../feature/order/orderSlice.js'
import adminReducer from '../feature/admin/adminSlice.js'
import wishlistReducer from "../feature/wishlist/wishlistSlice.js";

export const store =  configureStore({
    reducer:{
        product : productReducer,
        user : useReducer,
        cart:cartReducer,
        order:orderReducer,
        admin:adminReducer,
        wishlist: wishlistReducer,
    }
})