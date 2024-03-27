import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  isOpen: false,
}

const liveVideoModalSlice = createSlice({
  name: 'livevideomodal',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true
    },
    closeModal: (state) => {
      state.isOpen = false
    },
  },
})

export const { openModal, closeModal } = liveVideoModalSlice.actions
export default liveVideoModalSlice.reducer
