import { useSelector } from 'react-redux'
import NotFound from '../components/pages/NotFound'
import ResponsiveAppBar from '../layout/ResponsiveAppBar'

const UserRoute = ({ children }) => {
  // Check User
  const { user } = useSelector((state) => state.user)
  console.log(user)

  return (
    <>
      <ResponsiveAppBar />
      {user.token ? (
        children
      ) : (
        <div className="d-flex justify-content-center p-5">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading..</span>
          </div>
        </div>
      )}
    </>
  )
  // return children
}
export default UserRoute
