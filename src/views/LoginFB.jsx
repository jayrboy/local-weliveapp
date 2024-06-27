import React from 'react'
import Logo from '../assets/logo-192-1.png'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Paper, Box, Grid, Typography } from '@mui/material'
import FacebookLoginSDK from '../components/FacebookLoginSDK'
import LoadingFn from '../components/LoadingFn'

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

  function roleRedirect(role) {
    if (role === 'admin') {
      navigate('/admin/home')
    } else {
      navigate('/admin/home')
    }
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
