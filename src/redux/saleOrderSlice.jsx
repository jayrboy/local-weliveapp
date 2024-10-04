import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// const url = 'https://vercel-server-weliveapp.vercel.app/api/sale-order'
const url = 'https://api-weliveapp.azurewebsites.net/api/sale-order'
// const url = 'http://localhost:8000/api/sale-order'

const initialState = {
  orders: [],
  order: {},
  filteredOrders: [],
  totalQuantity: 0, // จำนวนสินค้ารวมที่คำนวณได้
  totalPrice: 0, // ราคารวมที่คำนวณได้
  totalExpressPrice: 0, // ค่าขนส่งที่คำนวณได้
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
        total += item.quantity
      })
      state.totalQuantity = total
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
    searchNameFacebook: (state, action) => {
      const searchTerm = action.payload.toLowerCase()
      state.filteredOrders = state.orders.filter(
        (order) => order.name.toLowerCase().includes(searchTerm) // แก้ไขตาม key ที่ถูกต้อง
      )
    },
    editOrder: (state, action) => {
      state.order.isPayment = false
    },
    updateExpress: (state, action) => {
      state.order.express = action.payload // ใช้ action.payload เพื่ออัปเดต express
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
      .addCase(getOrder.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.order = action.payload
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.isLoading = false
      })
  },
})

export const {
  clearOrders,
  calculateTotalQuantity,
  calculateTotalPrice,
  calculateTotalExpressPrice,
  searchNameFacebook,
  editOrder,
  updateExpress,
} = saleOrderSlice.actions

export default saleOrderSlice.reducer
