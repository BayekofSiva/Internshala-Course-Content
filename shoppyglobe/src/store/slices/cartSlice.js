import { createSlice, createSelector } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: {} }, // { [id]: {id, title, price, thumbnail, qty} }
  reducers: {
    addToCart(state, action) {
      const p = action.payload
      const existing = state.items[p.id]
      state.items[p.id] = existing
        ? { ...existing, qty: existing.qty + 1 }
        : { id: p.id, title: p.title, price: p.price, thumbnail: p.thumbnail, qty: 1 }
    },
    removeFromCart(state, action) {
      delete state.items[action.payload]
    },
    increment(state, action) {
      const it = state.items[action.payload]; if (it) it.qty += 1
    },
    decrement(state, action) {
      const it = state.items[action.payload]; if (it) it.qty = Math.max(1, it.qty - 1)
    },
    clearCart(state) { state.items = {} }
  }
})

export const { addToCart, removeFromCart, increment, decrement, clearCart } = cartSlice.actions

export const selectCartItems = (s) => Object.values(s.cart.items)
export const selectCartCount = createSelector([selectCartItems], items =>
  items.reduce((n, it) => n + it.qty, 0)
)
export const selectCartTotal = createSelector([selectCartItems], items =>
  items.reduce((sum, it) => sum + it.qty * it.price, 0)
)

export default cartSlice.reducer
