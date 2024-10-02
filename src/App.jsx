/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import { CssBaseline } from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import ResponsiveAppBar from './layout/ResponsiveAppBar'
import HomePage from './views/HomePage'

import Register from './views/Register'
import LoginV1 from './views/Login'

import AuthRoute from './routes/AuthRoute'
import UserRoute from './routes/UserRoute'

import LoadingFn from './components/LoadingFn'
import NotFound from './views/NotFound'

import Dashboard from './views/Dashboard'
import Info from './views/Info'
import ProductStock from './views/product/ProductStock'
import ProductGraph from './views/product/ProductGraph'

import DailyStock from './views/daily/DailyStock'
import DailyCreate from './views/daily/DailyCreate'
import DailyEdit from './views/daily/DailyEdit'
import DailyStockHistory from './views/daily/DailyStockHistory'

import SaleOrderList from './views/order/SaleOrderList'
import SaleOrder from './views/order/SaleOrder'
import SaleOrderSearch from './views/order/SaleOrderSearch'
import SaleOrderCheckout from './views/order/SaleOrderCheckout'
import SaleOrderReport from './views/order/SaleOrderReport'

import CustomerByOrder from './views/customer/CustomerByOrder'
import CustomerByOrderV2 from './views/customer/CustomerByOrderV2'

import CustomerEdit from './views/customer/CustomerEdit'
import CustomerSearch from './views/customer/CustomerSearch'

import ExpressList from './views/express/ExpressList'
import ExpressCreate from './views/express/ExpressCreate'
import ExpressDelete from './views/express/ExpressDelete'

import UserManage from './views/admin/UserManage'

import { useDispatch } from 'react-redux'
import { login } from './redux/userSlice'

import LoginFB from './views/LoginFB'
import Policy from './views/Policy'
import TermOfServices from './views/TermOfServices'

import Profile from './views/Profile'
import BookBank from './views/BookBank'
import CustomerByOrderV3 from './views/customer/CustomerByOrderV3'

// export const baseURL = 'https://vercel-server-weliveapp.vercel.app'
export const baseURL = 'https://api-weliveapp.azurewebsites.net'
// export const baseURL = 'http://localhost:8000'

function App() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    window.fbAsyncInit = function () {
      if (window.FB) {
        window.FB.init({
          appId: import.meta.env.VITE_APP_ID,
          xfbml: true,
          version: 'v20.0',
        })
        console.log({ message: 'Facebook SDK Initialized' })
      }
    }
    // Load the Facebook SDK script
    const loadFbSdk = () => {
      ;(function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) {
          return
        }
        js = d.createElement(s)
        js.id = id
        js.src = 'https://connect.facebook.net/en_US/sdk.js'
        fjs.parentNode.insertBefore(js, fjs)
      })(document, 'script', 'facebook-jssdk')
    }

    loadFbSdk()
  }, [])

  useEffect(() => {
    if (token) {
      fetch(`${baseURL}/api/current-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.username) {
            dispatch(
              login({
                _id: data._id,
                username: data.username,
                role: data.role,
                name: data.name,
                bank_account: data.bank_account,
                email: data.email,
                picture: data.picture,
                token: token,
                userAccessToken: data.userAccessToken,
                pages: data.pages,
              })
            )
            setLoading(false)
          } else {
            throw new Error('Invalid token')
          }
        })
        .catch((err) => {
          toast.error('Token หมดอายุหรือไม่ถูกต้อง: ' + err.message)
          setLoading(false)
          window.location.reload()
          localStorage.clear()
          navigate('/auth/login')
        })
    } else {
      setLoading(false)
    }
  }, [token, dispatch, navigate])

  return (
    <React.Fragment>
      {loading && <LoadingFn />}
      <CssBaseline />
      <ToastContainer position="top-center" autoClose={3000} />
      {/* Public */}
      <Routes>
        <Route
          path="*"
          element={
            <NotFound text="The page you are looking for does not exist." />
          }
        />
        <Route
          path="/"
          element={
            <>
              <ResponsiveAppBar />
              <HomePage />
            </>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginV1 />} />

        <Route path="/auth/login" element={<LoginFB />} />
        <Route
          path="/policy"
          element={
            <>
              <ResponsiveAppBar />
              <Policy />
            </>
          }
        />
        <Route
          path="/term"
          element={
            <>
              <ResponsiveAppBar />
              <TermOfServices />
            </>
          }
        />
        <Route
          path="/app/policy"
          element={
            <AuthRoute>
              <Policy />
            </AuthRoute>
          }
        />
        <Route
          path="/app/term"
          element={
            <AuthRoute>
              <TermOfServices />
            </AuthRoute>
          }
        />

        {/* เก็บรูปภาพเป็น text ด้วยไลบรารี Quill */}
        {/* <Route path="/order/:id" element={<CustomerByOrder />} /> */}
        {/* <Route path="/order/:id" element={<CustomerByOrderV2 />} /> */}

        {/* เก็บรูปภาพเป็น text ด้วย React.jsx และ Node.js */}
        <Route path="/order/:id" element={<CustomerByOrderV3 />} />

        {/* Admin */}
        <Route
          path="/profile"
          element={
            <AuthRoute>
              <Profile />
            </AuthRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <Dashboard />
            </AuthRoute>
          }
        />
        <Route
          path="/stock"
          element={
            <AuthRoute>
              <ProductStock />
            </AuthRoute>
          }
        />
        <Route
          path="/admin/product-graph/:id"
          element={
            <AuthRoute>
              <ProductGraph />
            </AuthRoute>
          }
        />

        <Route
          path="/sale-daily"
          element={
            <AuthRoute>
              <DailyStock />
            </AuthRoute>
          }
        />
        <Route
          path="/sale-daily/create"
          element={
            <AuthRoute>
              <DailyCreate />
            </AuthRoute>
          }
        />
        <Route
          path="/sale-daily/edit/:id"
          element={
            <AuthRoute>
              <DailyEdit />
            </AuthRoute>
          }
        />
        <Route
          path="/sale-daily/history"
          element={
            <AuthRoute>
              <DailyStockHistory />
            </AuthRoute>
          }
        />
        <Route
          path="/customer/search"
          element={
            <AuthRoute>
              <CustomerSearch />
            </AuthRoute>
          }
        />
        <Route
          path="/customer/edit/:id"
          element={
            <AuthRoute>
              <CustomerEdit />
            </AuthRoute>
          }
        />
        <Route
          path="/order/search"
          element={
            <AuthRoute>
              <SaleOrderSearch />
            </AuthRoute>
          }
        />
        <Route
          path="/express"
          element={
            <AuthRoute>
              <ExpressList />
            </AuthRoute>
          }
        />
        <Route
          path="/express/create"
          element={
            <AuthRoute>
              <ExpressCreate />
            </AuthRoute>
          }
        />
        <Route
          path="/express/delete"
          element={
            <AuthRoute>
              <ExpressDelete />
            </AuthRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <AuthRoute>
              <SaleOrderCheckout />
            </AuthRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <AuthRoute>
              <SaleOrder />
            </AuthRoute>
          }
        />
        <Route
          path="/bookbank"
          element={
            <AuthRoute>
              <BookBank />
            </AuthRoute>
          }
        />
        {/* Manage User */}
        <Route
          path="/admin/manage"
          element={
            <AuthRoute>
              <UserManage />
            </AuthRoute>
          }
        />
        {/* --------------- */}
        <Route
          path="/order"
          element={
            <AuthRoute>
              <SaleOrderList />
            </AuthRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <AuthRoute>
              <SaleOrderReport />
            </AuthRoute>
          }
        />
        <Route
          path="/info"
          element={
            <AuthRoute>
              <Info />
            </AuthRoute>
          }
        />
      </Routes>
    </React.Fragment>
  )
}

export default App
