import { configureStore } from '@reduxjs/toolkit'
import userReducer from './redux/userSlice'
import liveVideoModalReducer from './redux/liveVideoModalSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    livevideomodal: liveVideoModalReducer,
  },
})

export default store
