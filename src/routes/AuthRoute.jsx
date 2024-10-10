import { baseURL } from '../App'
import axios from 'axios'
import React, { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { onLoaded } from '../redux/liveSlice'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'

import SideBar from '../layout/SideBar'
import HeaderBar from '../layout/HeaderBar'
import NotFound from '../views/NotFound'
import LiveVideoModal from '../components/LiveVideoModal'
import LiveVideoModalV2 from '../components/LiveVideoModalV2'
import CommentBox from '../components/CommentBox'

const AuthRoute = ({ children }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { isOpen } = useSelector((state) => state.live)
  const themeMode = useSelector((state) => state.theme.mode)
  const darkTheme = createTheme({
    palette: {
      mode: themeMode, // ใช้ค่า 'light' หรือ 'dark' จาก Redux state
      ...(themeMode === 'dark'
        ? {
            background: {
              default: '#121212', // พื้นหลังหลักใน dark mode
              paper: '#1d1d1d', // พื้นหลังของ component เช่น Card, Modal
            },
            text: {
              primary: '#ffffff', // ข้อความหลักใน dark mode
              secondary: '#bbbbbb', // ข้อความรอง
            },
          }
        : {
            background: {
              default: '#f7fff7', // พื้นหลังหลักใน light mode
              paper: '#ffffff', // พื้นหลังของ component เช่น Card, Modal
            },
            text: {
              primary: '#000000', // ข้อความหลักใน light mode
              secondary: '#333333', // ข้อความรอง
            },
          }),
    },
  })

  const axiosFetch = useCallback(
    (authToken) => {
      // console.log(user)
      axios
        .post(
          `${baseURL}/api/current-admin`,
          {},
          {
            headers: {
              Authorization: 'Bearer ' + authToken,
            },
          }
        )
        .then((response) => {
          // console.log(response.data) // ดูข้อมูลที่ส่งกลับมาจาก API
        })
        .catch((error) => {
          console.log(error)
          dispatch(onLoaded())
        })
    },
    [user]
  )

  useEffect(() => {
    if (user.token) {
      axiosFetch(user.token)
    }
  }, [user, axiosFetch])

  useEffect(() => {
    document.body.classList.toggle('dark-mode', themeMode === 'dark')
  }, [themeMode])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {user.token ? (
        <div className="app">
          <div className="sidebar">
            <SideBar />
          </div>
          <main className="content">
            {/* {isOpen && <LiveVideoModal />} */}
            {isOpen && <LiveVideoModalV2 />}
            <HeaderBar />
            <div className="content_body">
              <Box>{children}</Box>
            </div>
            <CommentBox /> {/* Add the CommentBox here */}
          </main>
        </div>
      ) : (
        <NotFound text="Admin Not Permission" />
      )}
    </ThemeProvider>
  )
}

export default AuthRoute
