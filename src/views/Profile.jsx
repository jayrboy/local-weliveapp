import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Grid,
  Container,
  Paper,
} from '@mui/material'
import PostPage from '../components/PostPage'
import PostLiveVideo from '../components/PostLiveVideo'
import PostLiveVideoProfile from '../components/PostLiveVideoProfile'

const Profile = () => {
  const { user } = useSelector((state) => state.user)
  const [isOpenPost, setIsOpenPost] = useState(false)
  const [isOpenLiveVideo, setIsOpenLiveVideo] = useState(false)
  const [isOpenLiveVideoProfile, setIsOpenLiveVideoProfile] = useState(false)
  const [selectedPage, setSelectedPage] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  const scopes = JSON.parse(localStorage.getItem('scopes'))

  const handleActionClick = (type, pageOrUser) => {
    setSelectedPage(null)
    setSelectedUser(null)
    setIsOpenPost(false)
    setIsOpenLiveVideo(false)
    setIsOpenLiveVideoProfile(false)

    if (type === 'post') {
      setSelectedPage(pageOrUser)
      setIsOpenPost(true)
    } else if (type === 'live') {
      setSelectedPage(pageOrUser)
      setIsOpenLiveVideo(true)
    } else if (type === 'liveProfile') {
      setSelectedUser(pageOrUser)
      setIsOpenLiveVideoProfile(true)
    }
  }

  return (
    <Container maxWidth="lg" className="mt-3">
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <strong>User ID:</strong>
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <strong>Name:</strong>
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <strong>Email:</strong>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <strong>Access Token:</strong>
                      </TableCell>
                      <TableCell>
                        <TextField
                          variant="outlined"
                          size="small"
                          fullWidth
                          defaultValue={user.userAccessToken}
                          InputProps={{
                            readOnly: true,
                          }}
                          style={{ marginTop: 8 }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              {user.role === 'admin' && (
                <>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{ marginTop: 16 }}
                  >
                    <strong>Scopes:</strong>
                  </Typography>
                  <ul>
                    {scopes &&
                      scopes.map((scope, index) => (
                        <li key={index}>
                          <Typography variant="body2" color="textSecondary">
                            {scope}
                          </Typography>
                        </li>
                      ))}
                  </ul>
                </>
              )}
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleActionClick('liveProfile', user)}
                >
                  ไลฟ์สดบนเพจโปรไฟล์
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                <strong>Pages:</strong>
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Page Name</TableCell>
                      <TableCell>Access Token</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {user.pages.map((page, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            variant="outlined"
                            size="small"
                            defaultValue={page.id}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </TableCell>
                        <TableCell>{page.name}</TableCell>
                        <TableCell>
                          <TextField
                            variant="outlined"
                            size="small"
                            defaultValue={page.access_token}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </TableCell>
                        <TableCell>{page.category}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleActionClick('post', page)}
                            style={{ marginRight: '8px' }}
                          >
                            โพสต์
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => handleActionClick('live', page)}
                          >
                            ไลฟ์สด
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        {isOpenPost && (
          <Grid item xs={12}>
            <PostPage setIsOpenPost={setIsOpenPost} page={selectedPage} />
          </Grid>
        )}
        {isOpenLiveVideo && (
          <Grid item xs={12}>
            <PostLiveVideo
              setIsOpenLiveVideo={setIsOpenLiveVideo}
              page={selectedPage}
            />
          </Grid>
        )}
        {isOpenLiveVideoProfile && (
          <Grid item xs={12}>
            <PostLiveVideoProfile
              setIsOpenLiveVideoProfile={setIsOpenLiveVideoProfile}
              user={selectedUser}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default Profile
