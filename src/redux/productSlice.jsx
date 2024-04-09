import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const url = 'https://vercel-server-weliveapp.vercel.app/api/db/read'

const initialState = {
  products: [],
  isOpen: false,
}

export const getProducts = createAsyncThunk(
  'product/getProducts',
  async (name, thunkAPI) => {
    try {
      const resp = await axios(url)
      return resp.data
    } catch (error) {
      return thunkAPI.rejectWithValue('something went wrong')
    }
  }
)

const modalSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true
    },
    closeModal: (state) => {
      state.isOpen = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProducts.fulfilled, (state, action) => {
      // console.log(action);
      state.products = action.payload
    })
  },
})

export const { openModal, closeModal } = modalSlice.actions
export default modalSlice.reducer
