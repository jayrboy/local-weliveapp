import {
  Button,
  Paper,
  CssBaseline,
  TextField,
  Box,
  Grid,
  Typography,
} from '@mui/material'

import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'

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
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

export default function Register() {
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const formEnt = Object.fromEntries(formData.entries())

    if (formEnt.username && formEnt.password) {
      const userData = {
        username: formData.get('username'),
        password: formData.get('password'),
      }

      await axios.post('/api/register', userData).then((result) => {
        // console.log(result.data)
        if (result.data === 'User Already Exists!') {
          toast.warning(result.data)
        } else {
          toast.success(result.data)
          navigate('/login')
        }
      })
    } else {
      toast.error('กรุณากรอกข้อมูล')
    }
  }

  return (
    <Grid
      container
      component="main"
      item
      sx={{ height: '100vh', justifyContent: 'center' }}
    >
      <CssBaseline />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        sx={{
          my: 4,
          mx: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            my: 12,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo */}
          <Box display="flex" alignItems="center">
            <img src="./logo-192-1.png" alt="Logo" />
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            ></Typography>
          </Box>
          {/* Form */}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 2, width: '300px' }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
          </Box>
          {/* Footer */}
          <Copyright sx={{ mt: 5 }} />
        </Box>
      </Grid>
    </Grid>
  )
}
