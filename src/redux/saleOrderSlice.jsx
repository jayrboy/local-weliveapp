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
    calculateTotalQuantity: (state) => {
      let total = 0
      state.order.orders.map((item) => {
        total += item.stock_quantity * item.price
      })
      state.total = total
    },
    calculateTotalPrice: (state) => {
      let total = 0
      if (state.order.orders && state.order.orders.length > 0) {
        for (let i = 0; i < state.order.orders.length; i++) {
          total += state.order.orders[i].price * state.order.orders[i].quantity
        }
      }
      state.totalPrice = total
    },
    calculateTotalExpressPrice: (state) => {
      let totalQuantity = 0
      if (state.order.orders && state.order.orders.length > 0) {
        for (let i = 0; i < state.order.orders.length; i++) {
          totalQuantity += state.order.orders[i].quantity
        }
      }

      if (totalQuantity > 5 && totalQuantity <= 10) {
        state.totalExpressPrice = 100
      } else if (totalQuantity > 10) {
        state.totalExpressPrice = 200
      } else {
        state.totalExpressPrice = 50
      }
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

export const {
  clearOrders,
  calculateTotalQuantity,
  calculateTotalPrice,
  calculateTotalExpressPrice,
} = saleOrderSlice.actions

export default saleOrderSlice.reducer
