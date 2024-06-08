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

export const getAll = createAsyncThunk(
  'dailyStock/getAll',
  async (thunkAPI) => {
    try {
      const resp = await axios(url + '/read')
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

const dailyStockSlice = createSlice({
  name: 'dailyStock',
  initialState,
  reducers: {
    deletedProduct: (state, action) => {
      const index = action.payload
      state.dailyStock.products.splice(index, 1)
    },
    calTotals: (state) => {
      let stock_quantity = 0
      let total = 0
      state.dailyStock.products.map((item) => {
        stock_quantity += item.stock_quantity
        total += item.stock_quantity * item.price
      })
      state.stock_quantity = stock_quantity
      state.total = total
    },
    updateDailyStockStatus: (state, action) => {
      state.dailyStock.status = action.payload // อัปเดตค่า status
    },
    updateProduct: (state, action) => {
      const { index, formEnt } = action.payload

      state.dailyStock.products = state.dailyStock.products.map((p, i) => {
        if (i == index) {
          const stock_quantity = formEnt.stock_quantity
          p.remaining = stock_quantity - p.remaining_cf
          return { ...p, ...formEnt } // คัดลอกข้อมูลเดิม และอัปเดตเฉพาะข้อมูลที่ต้องการ
        }
        return p // ใช้ข้อมูลสินค้าเดิมสำหรับตำแหน่งที่ไม่ได้ถูกอัปเดต
      })
    },
    updatePriceTotal: (state, action) => {
      state.dailyStock.price_total = action.payload
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

export const {
  calTotals,
  deletedProduct,
  updateDailyStockStatus,
  updateProduct,
  updatePriceTotal,
} = dailyStockSlice.actions
export default dailyStockSlice.reducer
