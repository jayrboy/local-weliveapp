import { createSlice } from '@reduxjs/toolkit'

//TODO:
const initialState = {
  user: [],
  userFB: {},
  isLoading: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload
    },
    loginFB: (state, action) => {
      state.userFB = {
        _id: action.payload._id,
        name: action.payload.name,
        picture: action.payload.picture[0].data.url,
        email: action.payload.email,
      }
    },
    logout: (state) => {
      state.user = []
      state.userFB = {}
      localStorage.clear()
    },
    onLoading: (state) => {
      state.isLoading = true
    },
    onLoaded: (state) => {
      state.isLoading = false
    },
  },
})
// Action creators are generated for each case reducer function
export const { login, logout, loginFB, onLoading, onLoaded } = userSlice.actions
export default userSlice.reducer
