import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const url = 'https://vercel-server-weliveapp.vercel.app/api/sale-order'
// const url = 'http://localhost:8000/api/sale-order'

const initialState = {
  orders: [],
  order: {},
  isLoading: true,
}

export const getOrders = createAsyncThunk(
  'saleOrder/getOrders',
  async (thunkAPI) => {
    try {
      const resp = await axios(url, {
        method: 'GET',
      })
      return resp.data
    } catch (error) {
      return thunkAPI.rejectWithValue('something went wrong')
    }
  }
)

export const getOrder = createAsyncThunk(
  'saleOrder/getOrder',
  async (id, thunkAPI) => {
    try {
      const resp = await axios(`${url}/read/${id}`, {
        method: 'GET',
      })
      return resp.data
    } catch (error) {
      return thunkAPI.rejectWithValue('something went wrong')
    }
  }
)

const saleOrderSlice = createSlice({
  name: 'saleOrder',
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.orders = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        // console.log(action);
        state.isLoading = false
        state.orders = action.payload
      })
      .addCase(getOrders.rejected, (state, action) => {
        console.log(action)
        state.isLoading = false
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.order = action.payload
      })
  },
})

export const { clearOrders } = saleOrderSlice.actions

export default saleOrderSlice.reducer
