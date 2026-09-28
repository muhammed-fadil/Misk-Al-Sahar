import { createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem("user"));

const getWishlist = () => {
  if (!user) return [];

  return JSON.parse(
    localStorage.getItem(`wishlist_${user.id}`)
  ) || [];
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState: {
    items: getWishlist(),
  },

  reducers: {
    loadWishlist: (state, action) => {
      state.items = action.payload;
    },

    addToWishlist: (state, action) => {
      const exists = state.items.some(
        (item) => item.id === action.payload.id
      );

      if (!exists) {
        state.items.push(action.payload);

        if (user) {
          localStorage.setItem(
            `wishlist_${user.id}`,
            JSON.stringify(state.items)
          );
        }
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );

      if (user) {
        localStorage.setItem(
          `wishlist_${user.id}`,
          JSON.stringify(state.items)
        );
      }
    },

    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  loadWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;