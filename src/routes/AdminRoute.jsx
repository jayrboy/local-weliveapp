import { Box } from '@mui/material'
import SideBar from '../layout/SideBar'
import HeaderBar from '../layout/HeaderBar'
import { useEffect, useState, createContext } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import NotFound from '../components/pages/NotFound'
import LiveVideoModal from '../layout/LiveVideoModal'

export const firstLoadContext = createContext()

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user)
  // console.log('AdminRoute', user)
  // console.log('AdminRoute', user.token)

  const [loading, setLoading] = useState(false)

  const { isOpen } = useSelector((state) => state.livevideomodal)
  let [firstLoad, setFirstLoad] = useState(false)

  useEffect(() => {
    if (user.token) {
      console.log(user)
      axiosFetch(user.token)
    }
  }, [user])
  // console.log(user.user.role)

  const axiosFetch = async (authToken) =>
    await axios
      .post(
        '/api/current-admin',
        {},
        {
          headers: { authToken },
        }
      )
      .then((result) => {
        // console.log(result)
        setLoading(true)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })

  return loading ? (
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
  ) : (
    <NotFound text="Admin No Permission" />
  )
}
export default AdminRoute
