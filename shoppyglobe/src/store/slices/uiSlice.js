import { createSlice } from '@reduxjs/toolkit'
import { getSavedTheme } from '../../utils/theme.js'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    searchTerm: '',
    theme: getSavedTheme(),
  },
  reducers: {
    setSearchTerm(state, action) { state.searchTerm = action.payload },
    setTheme(state, action) { state.theme = action.payload },
  },
})

export const { setSearchTerm, setTheme } = uiSlice.actions
export const selectSearchTerm = (s) => s.ui.searchTerm
export const selectTheme = (s) => s.ui.theme
export default uiSlice.reducer
