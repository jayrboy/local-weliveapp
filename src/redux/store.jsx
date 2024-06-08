import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import modalReducer from './modalSlice'
import productReducer from './productSlice'
import dailyStockReducer from './dailyStockSlice'
import saleOrderReducer from './saleOrderSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    modal: modalReducer,
    product: productReducer,
    dailyStock: dailyStockReducer,
    saleOrder: saleOrderReducer,
  },
})

export default store
