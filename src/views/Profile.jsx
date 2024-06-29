import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { baseURL } from '../App'
import { useSelector } from 'react-redux'

import { Card, CardContent, Typography, Avatar } from '@mui/material'

const Profile = () => {
  const { user } = useSelector((state) => state.user)
  const pages = JSON.parse(localStorage.getItem('pages'))
  const scopes = JSON.parse(localStorage.getItem('scopes'))

  return (
    <div className="container mt-3">
      <div className="col-lg-6">
        <h3 className="text-start">
          <Link to="/dashboard" className="  text-decoration-none">
            PROFILE |
          </Link>
          <span className="text-success"> โปรไฟล์</span>
        </h3>
      </div>
      <div>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Welcome, {user.name}
            </Typography>
            <Avatar
              alt={user.name}
              src={user.picture[0].data.url}
              style={{ width: 100, height: 100, margin: '10px auto' }}
            />
            <Typography variant="body2" color="text.secondary">
              <strong>User ID:</strong> {user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Name:</strong> {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Scopes:</strong>
            </Typography>
            <ul>
              {scopes &&
                scopes.map((scope, index) => (
                  <li key={index}>
                    <Typography variant="body2" color="text.secondary">
                      {scope}
                    </Typography>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-1">
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              <strong>Pages:</strong>
            </Typography>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Page ID</th>
                  <th>Name</th>
                  <th>Page Access Token</th>
                  <th>Category</th>
                  {/* <th>Tasks</th> */}
                </tr>
              </thead>
              <tbody>
                {pages.map((page, index) => (
                  <tr key={index}>
                    <td>{page.id}</td>
                    <td>{page.name}</td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        defaultValue={page.access_token}
                      />
                    </td>
                    <td>{page.category}</td>
                    {/* <td>{page.tasks.join(', ')}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export default Profile
