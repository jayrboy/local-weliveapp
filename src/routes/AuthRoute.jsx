import { baseURL } from '../App'
import { Box } from '@mui/material'
import SideBar from '../layout/SideBar'
import HeaderBar from '../layout/HeaderBar'
import { useEffect, useState, createContext, useCallback } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import NotFound from '../views/NotFound'
import LiveVideoModal from '../components/LiveVideoModal'

export const firstLoadContext = createContext()
export const commentContext = createContext()

const AuthRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user)
  const { isOpen } = useSelector((state) => state.modal)

  let [firstLoad, setFirstLoad] = useState(false)
  let [comment, setComment] = useState([])

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
          setFirstLoad(false)
        })
    },
    [user]
  )

  useEffect(() => {
    if (user.token) {
      axiosFetch(user.token)
    }
  }, [user, axiosFetch])

  if (user.token) {
    return (
      <firstLoadContext.Provider value={[firstLoad, setFirstLoad]}>
        <commentContext.Provider value={[comment, setComment]}>
          <div className="app">
            <SideBar />
            <main className="content">
              {isOpen && <LiveVideoModal />}
              <HeaderBar />
              <div className="content_body">
                <Box>{children}</Box>
              </div>
            </main>
          </div>
        </commentContext.Provider>
      </firstLoadContext.Provider>
    )
  } else {
    return <NotFound text="Admin Not Permission" />
  }
}

export default AuthRoute
