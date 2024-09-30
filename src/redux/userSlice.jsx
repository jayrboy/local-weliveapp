import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'

//TODO:
const initialState = {
  user: [],
  userFB: {},
  isLoading: false,
  isCreateAccount: false,
  isEditAccount: false,
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
    onCreateAccount: (state) => {
      state.isCreateAccount = true
    },
    onCreatedAccount: (state) => {
      state.isCreateAccount = false
    },
    onEditAccount: (state) => {
      state.isEditAccount = true
    },
    onEditedAccount: (state) => {
      state.isEditAccount = false
    },
    createBankAccount: (state, action) => {
      const newBankAccount = {
        id: nanoid(),
        bankID: action.payload.bankID,
        bank: action.payload.bank,
        bankName: action.payload.bankName,
        promptPay: action.payload.promptPay,
      }
      state.user.bank_account.push(newBankAccount) // เพิ่มข้อมูลใหม่เข้าไปใน bank_account
    },
    updateBankAccount: (state, action) => {
      // อัปเดตข้อมูลบัญชีธนาคารใน user.bank_account
      const updatedAccount = action.payload
      state.user.bank_account = state.user.bank_account.map((account) =>
        account.id === updatedAccount.id ? updatedAccount : account
      )
    },
    removeBankAccount: (state, action) => {
      // กรองข้อมูล bank_account โดยลบรายการที่ตรงกับ id ที่ระบุใน action.payload
      state.user.bank_account = state.user.bank_account.filter(
        (account) => account.id !== action.payload.id
      )
    },
  },
})
// Action creators are generated for each case reducer function
export const {
  login,
  logout,
  loginFB,
  onLoading,
  onLoaded,
  createBankAccount,
  updateBankAccount,
  onCreateAccount,
  onCreatedAccount,
  onEditAccount,
  onEditedAccount,
  removeBankAccount,
} = userSlice.actions
export default userSlice.reducer
