import { baseURL } from '../App'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { login, onLoading, onLoaded } from '../redux/userSlice'

import { Box, Button } from '@mui/material'
import { FaFacebook } from 'react-icons/fa'

import { toast } from 'react-toastify'

const FacebookLoginSDK = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const loginFB = () => {
    window.FB.login(
      function (response) {
        if (response.status === 'connected') {
          dispatch(onLoading())
          const accessToken = response.authResponse.accessToken //short-lived access token

          window.FB.api(
            '/me',
            { fields: 'id, name, email, picture' },
            (userData) => {
              // console.log(userData)

              fetch(`${baseURL}/api/fb-sdk?token=${accessToken}`, {
                method: 'POST', // เปลี่ยนจาก GET เป็น POST
                headers: {
                  'Content-Type': 'application/json', // เพิ่ม headers เพื่อบอกว่า body เป็น JSON
                },
                body: JSON.stringify(userData), // แปลง userData เป็น JSON string
              })
                .then((resp) => resp.json())
                .then((data) => {
                  console.log('ข้อมูลตอบกลับจาก Server :', data)

                  dispatch(onLoaded())
                  dispatch(
                    login({
                      username: data.payload.user.username,
                      role: data.payload.user.role,
                      name: data.payload.user.name,
                      email: data.payload.user.email,
                      picture: data.payload.user.picture,
                      token: data.token,
                      userAccessToken: data.payload.user.userAccessToken,
                      pages: data.payload.user.pages,
                    })
                  )

                  toast.success(data.payload.user.name + ': login successfully')
                  localStorage.setItem('token', data.token)
                  localStorage.setItem(
                    'scopes',
                    JSON.stringify(data.payload.scopes)
                  )
                  navigate('/dashboard')
                })
            }
          )
        } else {
          toast.warning('ยกเลิกการเข้าสู่ระบบ')
          console.log('ผู้ใช้ยกเลิกการเข้าสู่ระบบ หรือไม่ได้อนุญาตโดยสมบูรณ์')
        }
      },
      {
        scope:
          'public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts',
      }
    )
  }

  return (
    <Box>
      <Button
        type="button"
        fullWidth={true}
        startIcon={<FaFacebook size={30} />}
        style={{
          backgroundColor: '#1877f2',
          color: 'white',
          textTransform: 'capitalize',
          fontSize: '16px',
          height: '40px',
          width: '300px',
        }}
        onClick={loginFB}
      >
        เข้าสู่ระบบด้วยบัญชี Facebook
      </Button>
    </Box>
  )
}

export default FacebookLoginSDK

//TODO: Login Facebook by used: weliveapplication@hotmail.com

/*
return response
{
    "authResponse": {
        "userID": "122129729402187406",
        "expiresIn": 3900,
        "accessToken": "EAAQi1tOQCP4BO2ZA5YhDaVniiJ1NpJ61ZAHZAHAWPZBXdnCzq1ZBplnJR1f24GbPwMnba6a8IhBhf06GnIhFQjmTZAX5kxsUPIoibK9NqJxmJpCCeRZBZC7ACVRSxOgye8KpZCPdCnpPU3B9taD4lkHs2Wu5jSVBt34K25JIyjWDelJvHuFX8jwgbAeM4okCt7KsvzYrZBtzEoSh4f6ICET6dNZC23KigZDZD",
        "signedRequest": "EOy5RGqYSznyzCt40onWWJAMqPiXrkT_RVttivy69qk.eyJ1c2VyX2lkIjoiMTIyMTI5NzI5NDAyMTg3NDA2IiwiY29kZSI6IkFRRGx5RDBPVURKX2d5MzR0bjZLUUVqWEF5UEJXY2oxVVVUOTVtRlFleHF1STYtWWJqaHpraVRXcTJZeGV1RHk5Q1lsNWxGTG1GVEtBdDdlZVUtMzhtSDAwVVdvbk9pUHVrNzJXX1BTOFVCZVpvY3hLT0luTFFRbXlWSDRKc2lHTVYyai1PYmtSdFY2a2ZjN1RPdWNNYS1NeXMxUllOd0hqNTFaVnBITndUazFDTDJXTzVjUEhVQTdxa1ZEQ1ZSQ2pJTmo1QkR0b0p4NGlpUVhkMExSOXBEc0lHZmFRQzV5MkpYQVdTNWpfUkhXdUg0VXN3UWtOY2EtbmZRaUxVV05NVzF5U3BEREJpdWJKdWd4NlBIOXNSUXpOZmY2Z2cxSDFkcW9pbjA3OVlPekQ0NjU1V0FnSTJiemxoN0NqUDlKUkJPenkyd0JQdTB4MF9taGtwdmVkV3NBTWoxTTBESDhtZTdlTjNSWGc5WXh5V3lGaS1pc0hEbHp6YzNPVHJRNzVDUSIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNzE5MDYwOTAwfQ",
        "graphDomain": "facebook",
        "data_access_expiration_time": 1726836900
    },
    "status": "connected"
}
*/

/*
GET /api/fb-sdk?token=EAAQi...
{
    "user": {
        "id": "122129729402187406",
        "name": "Jakkrit Onsomkrit",
        "email": "weliveapplication@hotmail.com",
        "picture": {
            "data": {
                "height": 50,
                "is_silhouette": false,
                "url": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=122129729402187406&height=50&width=50&ext=1721755550&hash=Aba-VzoD7G0E-A_V7i9diuuO",
                "width": 50
            }
        }
    },
    "scopes": [
        "user_videos",
        "email",
        "publish_video",
        "pages_show_list",
        "pages_read_engagement",
        "pages_manage_posts",
        "public_profile"
    ],
    "accessToken": "EAAGAtKWXZCNsBO18ZCEBKK22vcZCZAUymchEmEhPqj7fQtIukIHYWAUYR4LmqZCMurtBFd4bd1XHmBEiZBZCrXPDbzbaraXnnQhqT6NLHCMEizDj8zCQjbTMtWR80ZAhzAp85QBMERa6ZCqVQaHrncJuAgCNKOoJQZAmloF0aW9CmheQK7sWMpnkduOZA42QOXXRPZC5p3xq3y3YARfiGteyyv8U42qE8PFK5K8R"
}
*/

/*
/v20.0/me?fields=id,name,email,picture
{
    "id": "122129729402187406",
    "name": "Jakkrit Onsomkrit",
    "email": "weliveapplication@hotmail.com",
    "picture": {
        "data": {
            "height": 50,
            "is_silhouette": false,
            "url": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=122129729402187406&height=50&width=50&ext=1721754860&hash=Abab8FpIHBtXreECbQdnpnGH",
            "width": 50
        }
    }
}
*/
