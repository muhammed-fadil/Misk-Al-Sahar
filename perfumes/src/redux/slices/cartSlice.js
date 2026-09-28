import { createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem("user"));

const getCart = () => {
  if (!user) return [];

  return JSON.parse(
    localStorage.getItem(`cart_${user.id}`)
  ) || [];
};

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: getCart(),
  },

  reducers: {
    loadCart: (state, action) => {
      state.items = action.payload;
    },

    addToCart: (state, action) => {
      const item = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (item) {
        item.quantity = Math.min(
          item.quantity + action.payload.quantity,
          item.stock
        );
      } else {
        state.items.push(action.payload);
      }

      if (user) {
        localStorage.setItem(
          `cart_${user.id}`,
          JSON.stringify(state.items)
        );
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );

      if (user) {
        localStorage.setItem(
          `cart_${user.id}`,
          JSON.stringify(state.items)
        );
      }
    },

    updateQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (item) {
        item.quantity = Math.min(
          action.payload.quantity,
          item.stock
        );
      }

      if (user) {
        localStorage.setItem(
          `cart_${user.id}`,
          JSON.stringify(state.items)
        );
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  loadCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;