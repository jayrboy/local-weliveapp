import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import modalReducer from './modalSlice'
import productReducer from './productSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    modal: modalReducer,
    product: productReducer,
  },
})

export default store
