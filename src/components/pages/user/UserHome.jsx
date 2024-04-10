import React from 'react'
import UserOrder from './UserOrderID'

import { useSelector, useDispatch } from 'react-redux'

export default function UserHome() {
  const { user } = useSelector((state) => state.user)

  return (
    <React.Fragment>
      {user.length === 0 ? (
        <div
          className="card mt-5 mx-auto p-4 rounded"
          style={{ width: '400px', background: '#fff' }}
        >
          <h1>
            WE Live App <span className="badge bg-secondary">New</span>
          </h1>
          <p>Home Page User</p>
        </div>
      ) : (
        <UserOrder />
      )}
    </React.Fragment>
  )
}
