import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice.js'
import uiReducer from './slices/uiSlice.js'

const store = configureStore({
  reducer: {
    cart: cartReducer,
    ui: uiReducer,
  },
  // Redux DevTools is auto-enabled in development; kept explicit for clarity
  devTools: true,
})

export default store
