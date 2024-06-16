import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const url = 'https://vercel-server-weliveapp.vercel.app/api/daily'
// const url = 'http://localhost:8000/api/daily'

const initialState = {
  dailyStock: [],
  daily: {
    products: [],
  },
  stock: 0,
  total: 0,
  isLoading: false,
}

export const getAllDaily = createAsyncThunk(
  'dailyStock/getAllDaily',
  async (thunkAPI) => {
    try {
      const resp = await axios(url + '/read')
      return resp.data
    } catch (error) {
      return thunkAPI.rejectWithValue('something went wrong')
    }
  }
)

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

// export const updateDailyStock = createAsyncThunk(
//   'dailyStock/updateDailyStock',
//   async (dailyStock, thunkAPI) => {
//     try {
//       const resp = await axios.put(url + '/update', dailyStock)
//       return resp.data
//     } catch (error) {
//       return thunkAPI.rejectWithValue('something went wrong')
//     }
//   }
// )

const dailyStockSlice = createSlice({
  name: 'dailyStock',
  initialState,
  reducers: {
    deletedProduct: (state, action) => {
      const index = action.payload
      state.daily.products.splice(index, 1)
    },
    calTotals: (state) => {
      let stock_quantity = 0
      let total = 0
      state.daily.products.map((item) => {
        stock_quantity += item.stock_quantity
        total += item.stock_quantity * item.price
      })
      state.stock_quantity = stock_quantity
      state.total = total
    },
    getDailyStock: (state, action) => {
      state.dailyStock = action.payload
    },
    addProduct: (state, action) => {
      state.daily.products.push(action.payload)
    },
    updateDailyStockStatus: (state, action) => {
      state.dailyStock.status = action.payload // อัปเดตค่า status
    },
    updateProduct: (state, action) => {
      const { index, formEnt } = action.payload

      state.daily.products = state.daily.products.map((p, i) => {
        if (i == index) {
          return { ...p, ...formEnt } // คัดลอกข้อมูลเดิม และอัปเดตเฉพาะข้อมูลที่ต้องการ
        }
        return p // ใช้ข้อมูลสินค้าเดิมสำหรับตำแหน่งที่ไม่ได้ถูกอัปเดต
      })
    },
    addQuantityProduct: (state, action) => {
      const { index, formEnt } = action.payload

      state.daily.products = state.daily.products.map((p, i) => {
        if (i == index) {
          // เพิ่มจำนวนสินค้าใหม่
          p.stock_quantity += formEnt.stock_quantity

          // คำนวณจำนวนสินค้าที่เหลือ (remaining_cf)
          p.remaining_cf += formEnt.stock_quantity

          return { ...p }
        }
        return p
      })
    },
    updatePriceTotal: (state, action) => {
      state.daily.price_total = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllDaily.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllDaily.fulfilled, (state, action) => {
        // console.log(action);
        state.dailyStock = action.payload
      })
      .addCase(getAllDaily.rejected, (state, action) => {
        console.log(action)
        state.isLoading = false
      })
      .addCase(getDaily.fulfilled, (state, action) => {
        state.daily = action.payload
      })
    // .addCase(updateDailyStock.fulfilled, (state, action) => {
    //   state.dailyStock = action.payload
    // })
  },
})

export const {
  calTotals,
  deletedProduct,
  updateDailyStockStatus,
  updateProduct,
  updatePriceTotal,
  addProduct,
  addQuantityProduct,
} = dailyStockSlice.actions
export default dailyStockSlice.reducer
