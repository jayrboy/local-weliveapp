import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// const url = 'https://vercel-server-weliveapp.vercel.app/api/sale-order'
const url = 'http://localhost:8000/api/sale-order'

const initialState = {
  orders: [],
  isLoading: true,
}

export const getOrders = createAsyncThunk(
  'saleOrder/getOrders',
  async (thunkAPI) => {
    try {
      const token = localStorage.getItem('token')
      const resp = await axios(url, {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + token },
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
  },
})

export const { clearOrders } = saleOrderSlice.actions

export default saleOrderSlice.reducer
