import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Card, CardContent, Typography, Avatar } from '@mui/material'
import PostPage from '../components/PostPage'
import PostLiveVideo from '../components/PostLiveVideo'

const Profile = () => {
  const { user } = useSelector((state) => state.user)
  const [isOpenPost, setIsOpenPost] = useState(false)
  const [isOpenLiveVideo, setIsOpenLiveVideo] = useState(false)

  const [selectedPage, setSelectedPage] = useState(null) // เพิ่ม state นี้
  const pages = JSON.parse(localStorage.getItem('pages'))
  const scopes = JSON.parse(localStorage.getItem('scopes'))

  console.log(isOpenPost)

  const handlePostClick = (page) => {
    setSelectedPage(page) // กำหนด page ที่เลือก
    setIsOpenPost(true)
  }

  const handleLiveClick = (page) => {
    setSelectedPage(page) // กำหนด page ที่เลือก
    setIsOpenLiveVideo(true)
  }

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
            {user.role === 'admin' && (
              <>
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
              </>
            )}

            <div>
              <button className="btn btn-sm btn-primary">
                โพสต์บนเพจโปรไฟล์
              </button>
              &nbsp;
              <button className="btn btn-sm btn-danger">
                ไลฟ์สดบนเพจโปรไฟล์
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-1">
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              <strong>Pages:</strong>
            </Typography>
            <div className="table-responsive">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    {/* <th>ID</th> */}
                    <th>Page Name</th>
                    {/* <th>Access Token</th> */}
                    <th>Category</th>
                    {/* <th>Tasks</th> */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page, index) => (
                    <tr key={index}>
                      {/* <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          defaultValue={page.id}
                        />
                      </td> */}
                      <td>{page.name}</td>
                      {/* <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          defaultValue={page.access_token}
                        />
                      </td> */}
                      <td>{page.category}</td>
                      {/* <td>{page.tasks.join(', ')}</td> */}
                      <td>
                        <div>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handlePostClick(page)}
                          >
                            โพสต์
                          </button>
                          &nbsp;
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleLiveClick(page)}
                          >
                            ไลฟ์สด
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      {isOpenPost && (
        <PostPage setIsOpenPost={setIsOpenPost} page={selectedPage} />
      )}
      {isOpenLiveVideo && (
        <PostLiveVideo
          setIsOpenLiveVideo={setIsOpenLiveVideo}
          page={selectedPage}
        />
      )}
    </div>
  )
}

export default Profile
