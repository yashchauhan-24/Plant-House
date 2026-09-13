import { createSlice } from "@reduxjs/toolkit";
import { runPlantHouseCartWishlistMigration } from "../../utils/plantHouseCartWishlistMigration.js";

runPlantHouseCartWishlistMigration();

const readStoredWishlist = () => {
  try {
    const raw = localStorage.getItem("wishlistItems");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: readStoredWishlist(),
};

const persistWishlist = (items) => {
  localStorage.setItem("wishlistItems", JSON.stringify(items));
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlistItem: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((wishlistItem) => wishlistItem.product === item.product);

      if (existingItem) {
        state.items = state.items.filter((wishlistItem) => wishlistItem.product !== item.product);
      } else {
        state.items.push(item);
      }

      persistWishlist(state.items);
    },
    removeWishlistItem: (state, action) => {
      state.items = state.items.filter((item) => item.product !== action.payload);
      persistWishlist(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem("wishlistItems");
    },
  },
});

export const { toggleWishlistItem, removeWishlistItem, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
