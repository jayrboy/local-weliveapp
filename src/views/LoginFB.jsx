import { baseURL } from '../App'
import React, { useState } from 'react'
import Logo from '../assets/logo-192-1.png'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../redux/userSlice'
import { Paper, Box, Grid, Typography, Button } from '@mui/material'
import FacebookLoginSDK from '../components/FacebookLoginSDK'
import LoadingFn from '../components/LoadingFn'

import axios from 'axios'
import { toast } from 'react-toastify'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link to="/" className="text-primary text-decoration-none">
        WE Live App
      </Link>
      {' 2023-'}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const LoginFB = () => {
  const navigate = useNavigate()
  const { isLoading } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  let [isDisable, setIsDisable] = useState(false)

  function roleRedirect(role) {
    if (role === 'admin') {
      navigate('/dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsDisable(true)

    let formData = {
      username: 'admin',
      password: '1234',
    }

    return await axios({
      method: 'POST',
      url: `${baseURL}/api/login`,
      data: formData,
      headers: { 'Content-Type': 'application/json' },
    })
      .then((result) => {
        console.log(result.data)
        toast.success(result.data.payload.user.username + ' login successfully')
        dispatch(
          login({
            username: result.data.payload.user.username,
            role: result.data.payload.user.role,
            picture: result.data.payload.user.picture,
            token: result.data.token,
          })
        )
        localStorage.setItem('token', result.data.token)

        //TODO: remove comment, this redirect shouldn't need to be re-render from path login.
        roleRedirect(result.data.payload.user.role)
      })
      .catch((err) => {
        toast.error(err.response.data)
      })
  }

  return (
    <>
      {isLoading ? (
        <LoadingFn />
      ) : (
        <Grid
          container
          component="main"
          sx={{
            minHeight: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#EDE7F6', // Light background for business look
            padding: '2rem',
          }}
        >
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={10} // Increased elevation for a more prominent card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: '3rem', // More padding for a spacious look
              backgroundColor: '#fff',
              borderRadius: '8px', // Rounded corners for a modern look
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {/* Logo */}
              <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
                <img src={Logo} alt="Logo" style={{ height: '100px' }} />
              </Box>
              {/* Heading */}
              <Typography
                variant="h5"
                component="h1"
                sx={{ fontWeight: 'bold' }}
              >
                Web Application
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
                for Store Online
              </Typography>

              {/* Login Admin */}
              <Box>
                <Button
                  type="button"
                  variant="contained"
                  color="inherit"
                  sx={{ mb: 2 }}
                  startIcon={<AccountCircleIcon />}
                  onClick={handleSubmit}
                  disabled={isDisable}
                  style={{
                    color: 'black',
                    textTransform: 'capitalize',
                    fontSize: '16px',
                    height: '40px',
                    width: '300px',
                  }}
                >
                  เข้าสู่ระบบด้วยบัญชีแอดมิน
                </Button>
              </Box>

              {/* Facebook Login */}
              <FacebookLoginSDK />

              {/* Links */}
              <Grid
                container
                justifyContent="space-between"
                sx={{ mt: 1, width: '300px' }}
              >
                <Grid item>
                  <Link
                    to="https://www.facebook.com/login/identify/?ctx=recover&ars=facebook_login&from_login_screen=0"
                    style={{ color: '#1976d2', textDecoration: 'none' }}
                  >
                    ลืมรหัสผ่าน?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    to="https://www.facebook.com/reg/?next=%2Finfestsea%3Flocale%3Dth_TH"
                    style={{ color: '#1976d2', textDecoration: 'none' }}
                  >
                    สร้างบัญชี
                  </Link>
                </Grid>
              </Grid>
            </Box>
            {/* Footer */}
            <Copyright sx={{ mt: 5 }} />
          </Grid>
        </Grid>
      )}
    </>
  )
}
export default LoginFB
