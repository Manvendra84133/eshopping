import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  carts: []
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    addToCart: (state, action) => {
      const itemIndex = state.carts.findIndex((item) => item.id === action.payload.id);
      if (itemIndex >= 0) {
        state.carts[itemIndex].qty += 1;
      } else {
        state.carts.push({ ...action.payload, qty: 1 });
      }
    },

    decrementQty: (state, action) => {
      const itemIndex = state.carts.findIndex((item) => item.id === action.payload.id);

      if (state.carts[itemIndex].qty > 1) {
        state.carts[itemIndex].qty -= 1;
      } else {
        state.carts.splice(itemIndex, 1);
      }
    },

    removeFromCart: (state, action) => {
      // const itemIndex = state.carts.findIndex((item) => item.id === action.payload.id);
      // state.carts.splice(itemIndex, 1);

      state.carts = state.carts.filter((item) => item.id !== action.payload);
    },

    clearCart: (state) => {
      state.carts = [];
    }
  }
});

export const { addToCart, decrementQty, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;