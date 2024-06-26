import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  isOpen: false,
  isLoading: false,
}

const liveSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true
    },
    closeModal: (state) => {
      state.isOpen = false
    },
    onLoading: (state) => {
      state.isLoading = true
    },
    onLoaded: (state) => {
      state.isLoading = false
    },
  },
})

export const { openModal, closeModal, onLoaded, onLoading } = liveSlice.actions
export default liveSlice.reducer
