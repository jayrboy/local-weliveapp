import baseURL from '../baseURL'
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

  const { isOpen } = useSelector((state) => state.livevideomodal)
  let [firstLoad, setFirstLoad] = useState(false)

  useEffect(() => {
    if (user.token) {
      // console.log(user)
      const axiosFetch = (authToken) => {
        axios
          .post(
            `${baseURL}/api/current-admin`,
            {},
            {
              headers: { authToken },
            }
          )
          .then((result) => console.log(result))
          .catch((err) => alert(err))
      }
      axiosFetch(user.token)
    }
  }, [user])
  // console.log(user.user.role)

  if (!user.token) {
    return <NotFound text="Admin No Permission" />
  }

  return (
    <div className="app">
      <firstLoadContext.Provider value={[firstLoad, setFirstLoad]}>
        <SideBar />
        <main className="content">
          {isOpen && <LiveVideoModal />}
          <HeaderBar />
          <div className="content_body">
            <Box>{children}</Box>
          </div>
        </main>
      </firstLoadContext.Provider>
    </div>
  )
}
export default AdminRoute
