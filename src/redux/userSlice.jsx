import { createSlice } from '@reduxjs/toolkit'

//TODO:
const initialState = {
  user: [],
  userFB: {},
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
        accessToken: action.payload.accessToken,
        id: action.payload.id,
        name: action.payload.name,
        picture: action.payload.picture.data.url,
        email: action.payload.email,
      }
    },
    logout: (state) => {
      state.user = []
      localStorage.clear()
    },
  },
})
// Action creators are generated for each case reducer function
export const { login, logout, loginFB } = userSlice.actions
export default userSlice.reducer
