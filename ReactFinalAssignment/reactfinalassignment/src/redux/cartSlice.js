import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { payload: product, meta: { availableStock } } = action;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        if (existingItem.quantity >= availableStock) {
          throw new Error(`Only ${availableStock} items available in stock`);
        }
        existingItem.quantity++;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
    },
  },
});



export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;