import { createSlice } from '@reduxjs/toolkit'

//TODO:
const initialState = {
  mode: 'light', // ค่าเริ่มต้น
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light' // สลับระหว่าง 'light' และ 'dark'
    },
  },
})
// Action creators are generated for each case reducer function
export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer
