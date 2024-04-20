import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const url = 'https://vercel-server-weliveapp.vercel.app/api/daily'

export const getDaily = createAsyncThunk(
  'dailyStock/getDaily',
  async (id, thunkAPI) => {
    try {
      const resp = await axios(url + `/read/${id}`)
      return resp.data
    } catch (error) {
      return thunkAPI.rejectWithValue('something went wrong')
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'dailyStock/deleteProduct',
  async (productId, thunkAPI) => {
    try {
      // const resp = await axios.post(url + `/delete/${productId}`)
      const resp = await axios.post(
        `http://localhost:8000/api/daily/delete/${productId}`
      )
      thunkAPI.dispatch(deletedProduct(productId))
      return resp.data
    } catch (error) {
      console.log('delete product error')
      throw error
    }
  }
)

const initialState = {
  dailyStock: {
    products: [],
  },
  stock: 0,
  total: 0,
  isLoading: false,
}

const modalSlice = createSlice({
  name: 'dailyStock',
  initialState,
  reducers: {
    deletedProduct: (state, action) => {
      const productId = action.payload
      const index = state.dailyStock.products.findIndex(
        (product) => product._id === productId
      )
      if (index !== -1) {
        state.dailyStock.products.splice(index, 1)
      }
    },
    updateProductInState: (state, action) => {
      const { productId, updatedProduct } = action.payload
      const index = state.dailyStock.products.findIndex(
        (product) => product._id === productId
      )
      if (index !== -1) {
        state.dailyStock.products[index] = updatedProduct
      }
    },
    calTotals: (state) => {
      let stock = 0
      let total = 0
      state.dailyStock.products.map((item) => {
        stock += item.stock
        total += item.stock * item.price
      })
      state.stock = stock
      state.total = total
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDaily.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getDaily.fulfilled, (state, action) => {
        // console.log(action);
        state.dailyStock = action.payload
      })
      .addCase(getDaily.rejected, (state, action) => {
        console.log(action)
        state.isLoading = false
      })
  },
})

export const { calTotals, deletedProduct } = modalSlice.actions
export default modalSlice.reducer
