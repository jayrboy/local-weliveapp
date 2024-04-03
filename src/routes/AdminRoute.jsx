import baseURL from '../baseURL'
import { Box } from '@mui/material'
import SideBar from '../layout/SideBar'
import HeaderBar from '../layout/HeaderBar'
import { useEffect, useState, createContext, useCallback } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import NotFound from '../components/pages/NotFound'
import LiveVideoModal from '../layout/LiveVideoModal'

export const firstLoadContext = createContext()

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user)
  const { isOpen } = useSelector((state) => state.livevideomodal)

  let [firstLoad, setFirstLoad] = useState(false)

  const axiosFetch = useCallback(
    async (authToken) => {
      try {
        console.log(user)
        await axios.post(
          `${baseURL}/api/current-admin`,
          {},
          {
            headers: { authToken },
          }
        )
      } catch (error) {
        console.error(error)
        setFirstLoad(false)
      }
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
      </firstLoadContext.Provider>
    )
  } else {
    return <NotFound text="Admin Not Permission" />
  }
}

export default AdminRoute
