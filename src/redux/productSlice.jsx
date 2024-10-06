import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// const url = 'https://vercel-server-weliveapp.vercel.app/api/product'
const url = 'https://api-weliveapp.azurewebsites.net/api/product'
// const url = 'http://localhost:8000/api/product'
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
  productsToImport: [],
  isOpen: false,
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    deletedProductId: (state, action) => {
      return {
        ...state,
        products: state.products.filter(
          (product) => product._id !== action.payload
        ),
      }
    },
    deletedProduct: (state, action) => {
      const index = action.payload
      state.products.splice(index, 1)
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
    updateProduct: (state, action) => {
      const { index, formEnt } = action.payload

      state.products = state.products.map((p, i) => {
        if (i == index) {
          const stock_quantity = formEnt.stock_quantity
          p.remaining = p.remaining_cf - stock_quantity
          return { ...p, ...formEnt } // คัดลอกข้อมูลเดิม และอัปเดตเฉพาะข้อมูลที่ต้องการ
        }
        return p // ใช้ข้อมูลสินค้าเดิมสำหรับตำแหน่งที่ไม่ได้ถูกอัปเดต
      })
    },
    handleOpen: (state) => {
      state.isOpen = true
    },
    handleOpened: (state) => {
      state.isOpen = false
    },
    onImport: (state, action) => {
      state.productsToImport = action.payload
    },
    clearImport: (state) => {
      state.productsToImport = []
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

export const {
  calTotals,
  deletedProduct,
  updateProduct,
  handleOpen,
  handleOpened,
  onImport,
  clearImport,
} = productSlice.actions
export default productSlice.reducer
