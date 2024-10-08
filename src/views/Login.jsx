import { baseURL } from '../App'
import { useState, useRef, useEffect } from 'react'
import Logo from '../assets/logo-192-1.png'

import {
  Button,
  Paper,
  CssBaseline,
  Box,
  Grid,
  Typography,
} from '@mui/material'

import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../redux/userSlice'

import FacebookLoginSDK from '../components/FacebookLoginSDK'
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
      </Link>
      {' 2023-'}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  let [username, setUsername] = useState('')
  let [password, setPassword] = useState('')
  let [isDisable, setIsDisable] = useState(false)
  const form = useRef()
  const checkbox = useRef()

  //TODO: ตรวจสอบว่าได้จัดเก็บ username และ password ในแบบ cookies ไว้หรือไม่
  useEffect(() => {
    fetch(`${baseURL}/api/cookie/get`)
      .then((res) => res.json())
      .then((result) => {
        checkbox.current.checked = result.save
        setUsername(result.username)
        setPassword(result.password)
      })
      .catch((err) => alert(err))
  }, [])

  function roleRedirect(role) {
    if (role === 'admin') {
      navigate('/dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  //TODO: Login Main App
  async function handleSubmit(event) {
    event.preventDefault()
    setIsDisable(true)

    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())

    return await axios({
      method: 'POST',
      url: `${baseURL}/api/login`,
      data: formEnt,
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

  //TODO: Login Facebook
  // async function responseFacebook(response) {
  //   console.log(response)
  //   console.log('Access Token :', response.accessToken)

  //   localStorage.setItem('accessToken', response.accessToken)

  //   return await axios
  //     .post(`${baseURL}/api/login-facebook`, response)
  //     .then((result) => {
  //       // console.log(result.data)
  //       toast.success(result.data.payload.user.name + ' login successfully')
  //       dispatch(
  //         login({
  //           username: result.data.payload.user.username,
  //           role: result.data.payload.user.role,
  //           name: result.data.payload.user.name,
  //           email: result.data.payload.user.email,
  //           picture: result.data.payload.user.picture,
  //           token: result.data.token,
  //         })
  //       )
  //       localStorage.setItem('token', result.data.token)
  //       roleRedirect(result.data.payload.user.role)
  //     })
  //     .catch((err) => alert(err))
  // }

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
            <img src={Logo} alt="Logo" style={{ width: '100px' }} />
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
            ref={form}
          >
            <label className="form-label">Username</label>
            <input
              className="form-control form-control-lg mb-2"
              type="text"
              id="username"
              name="username"
              autoComplete="username"
              // defaultValue={username}
              defaultValue={'admin'}
            />
            <label className="form-label">Password</label>
            <input
              className="form-control form-control-lg"
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              // defaultValue={password}
              defaultValue={'1234'}
            />
            <div className="mt-3 form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="save"
                ref={checkbox}
              />
              <label className="form-check-label">&nbsp;Remember me</label>
            </div>
            <Button
              disabled={isDisable}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 4, mb: 2 }}
            >
              Login
            </Button>
            {/* <FacebookLoginSDK /> */}
          </Box>
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
        </Box>
        {/* Footer */}
        <Copyright sx={{ mb: 3 }} />
      </Grid>
    </Grid>
  )
}
export default Login
