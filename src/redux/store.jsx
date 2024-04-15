import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import modalReducer from './modalSlice'
import productReducer from './productSlice'
import dailyStockReducer from './dailyStockSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    modal: modalReducer,
    product: productReducer,
    dailyStock: dailyStockReducer,
  },
})

export default store
