import { createSlice } from "@reduxjs/toolkit";

const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getCart = () => {
  const user = getUser();

  if (!user) return [];

  return JSON.parse(
    localStorage.getItem(`cart_${user.id}`)
  ) || [];
};

const saveCart = (items) => {
  const user = getUser();

  if (user) {
    localStorage.setItem(
      `cart_${user.id}`,
      JSON.stringify(items)
    );
  }
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

      saveCart(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );

      saveCart(state.items);
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

      saveCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCart([]);
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