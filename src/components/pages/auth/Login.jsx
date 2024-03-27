import {
  Button,
  Paper,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Grid,
  Typography,
} from '@mui/material'

import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../../../redux/userSlice'

import { FacebookLogin } from 'facebook-login-react'
import { FaFacebook } from 'react-icons/fa'

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

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  //TODO: Login Main App
  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const formEnt = Object.fromEntries(formData.entries())

    if (formEnt.username && formEnt.password) {
      const userData = {
        username: formData.get('username'),
        password: formData.get('password'),
      }

      await axios
        .post('/api/login', userData)
        .then((result) => {
          // console.log(result.data)
          toast.success(
            result.data.payload.user.username + ' login successfully'
          )
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
        .catch((err) => toast.error(err.response.data))
    }
  }

  const roleRedirect = (role) => {
    // console.log(role)
    if (role === 'admin') {
      navigate('/admin/home')
    } else {
      navigate('/user/home')
    }
  }

  //TODO: Login Facebook
  async function responseFacebook(response) {
    // console.log(response)

    await axios
      .post('/api/login-facebook', response)
      .then((result) => {
        // console.log(result.data)
        toast.success(result.data.payload.user.name + ' login successfully')
        dispatch(
          login({
            username: result.data.payload.user.username,
            role: result.data.payload.user.role,
            name: result.data.payload.user.name,
            email: result.data.payload.user.email,
            picture: result.data.payload.user.picture,
            token: result.data.token,
          })
        )
        localStorage.setItem('token', result.data.token)
        roleRedirect(result.data.payload.user.role)
      })
      .catch((err) => alert(err))
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            {/* Facebook Login : autoLoad={true} login auto)*/}

            <FacebookLogin
              appId="268883909602018"
              // version="19.0"
              // xfbml={true}
              // cookie={true}
              autoLoad={false}
              fields="name,email,picture"
              scope="public_profile"
              callback={responseFacebook}
              render={(renderProps) => (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mb: 2 }}
                  onClick={renderProps.onClick}
                  startIcon={<FaFacebook />}
                >
                  Login With Facebook
                </Button>
              )}
            />
          </Box>
          {/* Footer */}
          <Grid container>
            <Grid item xs>
              <Link to="#" className="text-decoration-none">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register" className="text-decoration-none">
                Register
              </Link>
            </Grid>
          </Grid>
          <Copyright sx={{ mt: 5 }} />
        </Box>
      </Grid>
    </Grid>
  )
}
