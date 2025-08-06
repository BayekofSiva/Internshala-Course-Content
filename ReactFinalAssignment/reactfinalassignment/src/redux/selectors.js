export const selectCartItems = (state) => state.cart.items;

export const selectCartItemCount = (state) => 
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);