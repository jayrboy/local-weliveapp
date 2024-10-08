import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import liveReducer from './liveSlice'
import productReducer from './productSlice'
import dailyStockReducer from './dailyStockSlice'
import saleOrderReducer from './saleOrderSlice'
import themeReducer from './themeSlice'
import commentReducer from './commentSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    live: liveReducer,
    product: productReducer,
    dailyStock: dailyStockReducer,
    saleOrder: saleOrderReducer,
    theme: themeReducer,
    comment: commentReducer,
  },
})

export default store
