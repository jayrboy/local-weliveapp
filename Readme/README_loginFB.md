# Install library `facebook-login-react` by sb89 published 1.0.6

- https://www.npmjs.com/package/facebook-login-react

```sh
ืnpm i facebook-login-react
```

## Add Button Login with Facebook

```js
import React, { useState } from 'react'
import { FacebookLogin } from 'facebook-login-react'
import { Button } from '@mui/material'

const FacebookLoginReact = () => {
  const [accessToken, setAccessToken] = useState('')

  const responseFacebook = (response) => {
    console.log(response)
    setAccessToken(response.accessToken)
  }

  return (
    <React.Fragment>
      Facebook Login React
      <br />
      User Short-Lived Access Token :<br />
      <code>{accessToken}</code>
      <br />
      <FacebookLogin
        appId="422988337380571"
        autoLoad={false}
        fields="name,email,picture"
        scope="public_profile"
        callback={responseFacebook}
        render={(renderProps) => (
          <Button
            type="button"
            onClick={renderProps.onClick}
            startIcon={<FaFacebook />}
            style={{ backgroundColor: '#1877f2', color: 'white' }}
          >
            LOGIN WITH FACEBOOK
          </Button>
        )}
      />
    </React.Fragment>
  )
}
export default FacebookLoginReact
```

### Get a Short-Lived Access Token

Test Graph API from Meta or Postman
