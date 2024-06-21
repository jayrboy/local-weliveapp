import React from 'react'

// https://www.npmjs.com/package/facebook-login-react
import { FacebookLogin } from 'facebook-login-react'
import { FaFacebook } from 'react-icons/fa'

import { Button, Card, CardContent, Typography, Avatar } from '@mui/material'

import { useDispatch, useSelector } from 'react-redux'
import { loginFB } from '../redux/userSlice'

//? https://developers.facebook.com/docs/permissions

const FacebookLoginReact = () => {
  const dispatch = useDispatch()
  const { userFB } = useSelector((state) => state.user)

  const responseFacebook = (response) => {
    console.log(response)
    dispatch(loginFB(response))
  }

  return (
    <div className="container">
      <h1>Facebook Login React</h1>
      <p>
        User Short-Lived Access Token : <br />
        <code>{userFB.accessToken}</code>
      </p>
      <FacebookLogin
        appId="1164205974620414"
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFacebook}
        render={(renderProps) => (
          <Button
            type="button"
            onClick={renderProps.onClick}
            startIcon={<FaFacebook />}
            style={{ backgroundColor: '#1877f2', color: 'white' }}
          >
            Login with Facebook
          </Button>
        )}
      />
      {userFB.accessToken && (
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Welcome, {userFB.name}
            </Typography>
            <Avatar
              alt={userFB.name}
              src={userFB.picture}
              style={{ width: 100, height: 100, margin: '10px auto' }}
            />
            <Typography variant="body2" color="text.secondary">
              <strong>User ID:</strong> {userFB.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Name:</strong> {userFB.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Email:</strong> {userFB.email}
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default FacebookLoginReact
