import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const url = 'https://vercel-server-weliveapp.vercel.app/api/db/read'

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

const initialState = {
  products: [],
  amount: 0,
  total: 0,
  isLoading: false,
}

const modalSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    calculateTotals: (state) => {
      let amount = 0
      let total = 0
      state.cartItems.forEach((item) => {
        amount += item.amount
        total += item.amount * item.price
      })
      state.amount = amount
      state.total = total
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        // console.log(action);
        state.products = action.payload
      })
      .addCase(getProducts.rejected, (state, action) => {
        console.log(action)
        state.isLoading = false
      })
  },
})

export const { calculateTotals } = modalSlice.actions
export default modalSlice.reducer
