import { createSlice } from '@reduxjs/toolkit'
import { comments } from '../comments'

const initialState = {
  comments: [],
  isLoadingCm: false,
}

export const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    pushComment: (state, action) => {
      state.comments.push(action.payload) // ใช้ .push เพื่อเพิ่มความคิดเห็นใหม่เข้าไปในอาเรย์
    },
    reloadComments: (state, action) => {
      state.isLoadingCm = true // ตั้งค่าสถานะ loading เป็น true เมื่อเริ่มรีโหลดคอมเมนต์
    },
    setComments: (state, action) => {
      state.comments = action.payload // อัปเดตคอมเมนต์ใน state
      state.isLoadingCm = false // รีโหลดเสร็จสิ้น ตั้งค่า loading เป็น false
    },
    getComments: (state) => {
      state.isLoadingCm = false
    },
  },
})
// Action creators are generated for each case reducer function
export const { pushComment, reloadComments, setComments, getComments } =
  commentSlice.actions

export default commentSlice.reducer
