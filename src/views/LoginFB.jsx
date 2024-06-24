import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Paper, Box, Grid, Typography } from '@mui/material'
import FacebookLoginSDK from '../components/FacebookLoginSDK'

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

  function roleRedirect(role) {
    if (role === 'admin') {
      navigate('/admin/home')
    } else {
      navigate('/admin/home')
    }
  }

  return (
    <Grid
      container
      component="main"
      sx={{
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5', // Light grey background for business look
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
          alignItems: 'center',
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
            <img
              src="./logo-192-1.png"
              alt="Logo"
              style={{ height: '100px' }}
            />
          </Box>

          {/* Heading */}
          <Typography
            variant="h5"
            component="h1"
            sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}
          >
            Web Application for Store Online
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, color: '#666', textAlign: 'center' }}
          >
            Please login to continue to your account
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
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                to="https://www.facebook.com/reg/?next=%2Finfestsea%3Flocale%3Dth_TH"
                style={{ color: '#1976d2', textDecoration: 'none' }}
              >
                Register
              </Link>
            </Grid>
          </Grid>
        </Box>
        {/* Footer */}
        <Copyright sx={{ mt: 5 }} />
      </Grid>
    </Grid>
  )
}
export default LoginFB
