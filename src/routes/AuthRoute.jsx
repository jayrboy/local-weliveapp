import { baseURL } from '../App'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { onLoaded } from '../redux/liveSlice'

import { Box } from '@mui/material'
import SideBar from '../layout/SideBar'
import HeaderBar from '../layout/HeaderBar'
import { useEffect, useCallback } from 'react'
import axios from 'axios'

import NotFound from '../views/NotFound'
import LiveVideoModal from '../components/LiveVideoModal'
import LiveVideoModalV2 from '../components/LiveVideoModalV2'

const AuthRoute = ({ children }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { isOpen } = useSelector((state) => state.live)

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

  return (
    <React.Fragment>
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
          </main>
        </div>
      ) : (
        <NotFound text="Admin Not Permission" />
      )}
    </React.Fragment>
  )
}

export default AuthRoute
