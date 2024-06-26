import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import liveReducer from './liveSlice'
import productReducer from './productSlice'
import dailyStockReducer from './dailyStockSlice'
import saleOrderReducer from './saleOrderSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    live: liveReducer,
    product: productReducer,
    dailyStock: dailyStockReducer,
    saleOrder: saleOrderReducer,
  },
})

export default store
