import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import store from './redux/store'
import { Provider } from 'react-redux'
import { Helmet, HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <HelmetProvider>
        <>
          <App />
          {/* Add Facebook SDK for JavaScript */}
          <Helmet>
            <script
              async
              defer
              crossorigin="anonymous"
              src="https://connect.facebook.net/en_US/sdk.js"
            />
          </Helmet>
        </>
      </HelmetProvider>
    </Provider>
  </BrowserRouter>
)
