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

/*
{
    "name": "Jakkrit Onsomkrit",
    "email": "weliveapplication@hotmail.com",
    "picture": {
        "data": {
            "height": 50,
            "is_silhouette": false,
            "url": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=122129729402187406&height=50&width=50&ext=1721652823&hash=AbYJmWL0tgmxbqU7Z5VwmKiU",
            "width": 50
        }
    },
    "id": "122129729402187406",
    "userID": "122129729402187406",
    "expiresIn": 3978,
    "accessToken": "EAAQi1tOQCP4BO8VJ5ZBh1zpqTXjEnR20GJOSao55KN2ZAo261ju0gBMZClhpCeK5szzU9rOI2OC3c3GRbTbWgUQ1WsDZBETOC8ulgT17n2Sj9f0T6mygEDSiRTzF6x77ENMUJVuhExinV7XmZCYwKmqatdyhPOZC2IpZCle577BcIUThosI8TTi1T5LTCgsGRPPpgqvqZBZAgWw4n70BOrdIvUlpZCnwZDZD",
    "signedRequest": "retbCrEw0lNC9GK2mgJAJ2jhV0k4-FN9DpkSoSRJf-8.eyJ1c2VyX2lkIjoiMTIyMTI5NzI5NDAyMTg3NDA2IiwiY29kZSI6IkFRQTh5THFYT0V2d3RSNFlXdEwtb0lEb2RFb1pUYVlZdWljN0twT2NyU0xNQzlnQS1QZ1Q0UDBLZ3pnc1huSWkyOHJGSFRKYjFmaTRLSTNVS0ZNTmVFNGV2M1dmZzZTSzNzX2dTSkI1Z3NmWk9vcVBGdm9GSk5fQ1QtSjhRdXJXeExpWWRkWFhnci1ERV81Vm9aZWg5aEFwa2VSZ3BWcEtUMEtNMlYwRFA4bF8tblltcjFHanJaMV9sMDdiNUcxUGZkdjRZV1Q2RVRMU0xzc1ZCM0FIb3FNYzRaYi03N3lsZ1F6SHFOTEdJX3FDVGFTa190TjI3SkNvcUQyWTljWUZiQ1JSc0pIZnR4eTJXbnlRY1dfUlQxZ3BibmNpNllOTXM2T3hEaHlkekRTY01Ic2JKSDA1ZG1XeE9jbm9nUXNBUm1kdV9OaV85eDdyNUNTQm81VzFpSGkybDljMHoxZ2RoUE1fVndKMnV3a08tVUN5dHZka0owajJiSHpleV9WWEdCSSIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNzE5MDYwODIyfQ",
    "graphDomain": "facebook",
    "data_access_expiration_time": 1726836822
}
*/
