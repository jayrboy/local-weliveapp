# ตั่งค่าการเข้าสู่ระบบ Login SDK ที่ setting บนแอป Meta

1. การเข้าสู่ระบบ Facebook -> การตั้งค่า -> Login with the JavaScript SDK
   https://developers.facebook.com/apps/1164205974620414/fb-login/settings/

## โหลดและกำหนดค่า Facebook SDK

2. Facebook JavaScript SDK โดยการเพิ่ม script ลงใน `App.jsx`
   https://developers.facebook.com/docs/javascript/quickstart

- ติดตั้ง `react-helmet` หรือ `react-helmet-async` เพื่อจัดการ script

```sh
npm i react-helmet
```

```js
import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import FacebookLoginSDK from './test/FacebookLoginSDK'

function App() {
  useEffect(() => {
    window.fbAsyncInit = function () {
      if (window.FB) {
        window.FB.init({
          appId: '1164205974620414',
          xfbml: true,
          version: 'v20.0',
        })
        console.log({ message: 'FB SDK Initialized' })
      } else {
        console.log({ error: 'FB SDK not initialized' })
      }
    }
  }, [])

  return (
    <React.Fragment>
      <Rotes>
        <Route path="/test/fb-sdk" element={<FacebookLoginSDK />} />
      </Rotes>
      {/* Add Facebook SDK for JavaScript */}
      <Helmet>
        <script
          async
          defer
          crossorigin="anonymous"
          src="https://connect.facebook.net/en_US/sdk.js"
        />
      </Helmet>
    </React.Fragment>
  )
}
```

### สร้าง Component สำหรับปุ่ม Facebook Login SDK

3. สร้างไฟล์ `FacebookLoginSDK.jsx` เพิ่มโค้ดเพื่อโหลดฟังก์ชันและกำหนดค่า SDK

```js
import React from 'react'

const FacebookLoginSDK = () => {
  function login() {
    window.FB.login(
      (response) => {
        if (response.status === 'connected') {
          console.log(response)
          console.log(response.authResponse.accessToken)
        } else {
          console.log('User not authenticated')
        }
      },
      { scope: 'public_profile' }
    )
  }

  return (
    <>
      <h1>Facebook SDK for JavaScript</h1>
      <br />
      <button onClick={login}>Login</button>
    </>
  )
}

export default FacebookLoginSDK
```

# Response Facebook

```json
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
```

## รับ App Access Token โดยการส่ง GET ไปขอที่ Web Server

- Add fetch data to login() `FacebookLoginSDK.jsx`

```js
function login() {
  window.FB.login(
    (response) => {
      if (response.status === 'connected') {
        fetch(`${baseURL}/api/fb-sdk?token=${response.authResponse.accessToken}`)
          .then((response) => response.json())
          .then((data) => console.log('Data :', data))
      } else {
        console.log('User not authenticated')
      }
    },
    { scope: 'public_profile' }
  )
}
```

# Get Pages Access Token

- ตรวจสอบว่าสร้างแอป Meta แบบ Business
- เพิ่มสิทธิ์ `pages_read_engagement` ใน scope ตอน login()

```js
{
  scope: 'public_profile,pages_read_engagement'
}
```

# Create Page Content

- ตรวจสอบว่าสร้างแอป Meta แบบ Business
- เพิ่มสิทธิ์ `pages_read_engagement` ใน scope ตอน login()

```js
{
  scope: 'public_profile,pages_read_engagement,pages_manage_posts'
}
```
