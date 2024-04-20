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
  stock: 0,
  total: 0,
  isLoading: false,
}

const modalSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    deletedProduct: (state, action) => {
      return {
        ...state,
        products: state.products.filter(
          (product) => product._id !== action.payload
        ),
      }
    },
    calTotals: (state) => {
      let stock = 0
      let total = 0
      state.products.forEach((item) => {
        stock += item.stock
        total += item.stock * item.price
      })
      state.stock = stock
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

export const { calTotals, deletedProduct } = modalSlice.actions
export default modalSlice.reducer
