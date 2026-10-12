import { createSlice } from "@reduxjs/toolkit";

const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getWishlist = () => {
  const user = getUser();

  if (!user) return [];

  return JSON.parse(
    localStorage.getItem(`wishlist_${user.id}`)
  ) || [];
};

const saveWishlist = (items) => {
  const user = getUser();

  if (user) {
    localStorage.setItem(
      `wishlist_${user.id}`,
      JSON.stringify(items)
    );
  }
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
        saveWishlist(state.items);
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );

      saveWishlist(state.items);
    },
  },
});

export const {
  loadWishlist,
  addToWishlist,
  removeFromWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;