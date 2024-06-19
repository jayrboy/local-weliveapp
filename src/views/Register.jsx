import { baseURL } from '../App'
import {
  Button,
  Paper,
  CssBaseline,
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

      await axios.post(`${baseURL}/api/register`, userData).then((result) => {
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
    <Grid container component="main" item sx={{ justifyContent: 'center' }}>
      <CssBaseline />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        sx={{
          mt: 2,
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
            <label className="form-label">Username</label>
            <input
              className="form-control form-control-lg mb-2"
              type="text"
              id="username"
              name="username"
              autoComplete="username"
            />
            <label className="form-label">Password</label>
            <input
              className="form-control form-control-lg mb-5"
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mb: 2 }}>
              Register
            </Button>
            <Button
              onClick={() => navigate('/login')}
              fullWidth
              variant="outlined"
            >
              Back
            </Button>
          </Box>
        </Box>
        {/* Footer */}
        <Copyright sx={{ mb: 3 }} />
      </Grid>
    </Grid>
  )
}
