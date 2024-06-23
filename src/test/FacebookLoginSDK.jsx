import React from 'react'
import { baseURL } from '../App'

import { Button } from '@mui/material'
import { FaFacebook } from 'react-icons/fa'

const FacebookLoginSDK = () => {
  function login() {
    window.FB.login(
      (response) => {
        if (response.status === 'connected') {
          console.log(response.authResponse.accessToken)

          fetch(
            `${baseURL}/api/fb-sdk?token=${response.authResponse.accessToken}`
          )
            .then((response) => response.json())
            .then((data) => console.log('Data :', data))
        } else {
          console.log('User not authenticated')
        }
      },
      { scope: 'public_profile,pages_read_engagement' }
    )
  }

  return (
    <div className="container">
      <h1>Facebook SDK for JavaScript</h1>
      <br />
      <div className="text-center">
        <Button
          type="button"
          onClick={login}
          startIcon={<FaFacebook size={35} />}
          style={{ backgroundColor: '#1877f2', color: 'white' }}
        >
          Login With Facebook
        </Button>
      </div>
    </div>
  )
}

export default FacebookLoginSDK

//TODO: Login Facebook by used: weliveapplication@hotmail.com

/*
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
