import { useEffect, useRef, useState } from 'react'
import { baseURL } from '../App'
import { useSelector } from 'react-redux'

const Profile = () => {
  const tokenRef = useRef()
  const accessToken = localStorage.getItem('accessToken')
  const { user } = useSelector((state) => state.user)

  useEffect(() => {
    if (accessToken) {
      tokenRef.current.value = accessToken
    }
  }, [])

  const saveToken = () => {
    let token = tokenRef.current.value

    if (token !== '' && !token.match(/^[0-9a-zZ-Z]+$/)) {
      return alert('ต้องเป็น 0-9 หรือ a-z หรือ A-Z เท่านั้น')
    }


    // fetch(`${baseURL}/api/fb-sdk?token=${accessToken}`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log('Saved Token :', token)
    //     console.log('Data :', data)
    //   })
  }

  const disconnectToken = () => {
    console.log('Disconnected Token')
  }

  return (
    <div className="container mt-3">
      <h4>Profile</h4>
      {user.role === 'admin' && (
        <>
          {accessToken ? (
            <form>
              <div>
                <label>Facebook Account</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Access Token"
                  ref={tokenRef}
                  disabled={true}
                  required
                />
                <div className="text-end mt-2">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={disconnectToken}
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form>
              <div>
                <label>Facebook Account</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Access Token"
                  ref={tokenRef}
                  required
                />
                <div className="text-end mt-2">
                  <button
                    type="button"
                    onClick={saveToken}
                    className="btn btn-primary btn-sm"
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  )
}
export default Profile
