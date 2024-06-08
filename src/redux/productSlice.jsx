import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const url = 'https://vercel-server-weliveapp.vercel.app/api/product'
const token = localStorage.getItem('token')

export const getProducts = createAsyncThunk(
  'product/getProducts',
  async (name, thunkAPI) => {
    try {
      const resp = await axios(url, {
        headers: { Authorization: 'Bearer ' + token },
      })
      return resp.data
    } catch (error) {
      return thunkAPI.rejectWithValue('something went wrong')
    }
  }
)

const initialState = {
  products: [],
  stock_quantity: 0,
  total: 0,
  isLoading: false,
}

const productSlice = createSlice({
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
      let stock_quantity = 0
      let total = 0
      state.products.forEach((item) => {
        stock_quantity += item.stock_quantity
        total += item.stock_quantity * item.price
      })
      state.stock_quantity = stock_quantity
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

export const { calTotals, deletedProduct } = productSlice.actions
export default productSlice.reducer
