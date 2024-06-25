/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import { CssBaseline } from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import ResponsiveAppBar from './layout/ResponsiveAppBar'

import Register from './views/Register'
import LoginV1 from './views/Login'
import LoginFB from './views/LoginFB'

import AdminRoute from './routes/AdminRoute'
import UserRoute from './routes/UserRoute'

import HomePage from './views/HomePage'
import NotFound from './views/NotFound'

import UserHome from './views/user/UserHome'
import UserManage from './views/user/UserManage'

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
import CustomerEdit from './views/customer/CustomerEdit'
import CustomerSearch from './views/customer/CustomerSearch'

import ExpressList from './views/express/ExpressList'
import ExpressCreate from './views/express/ExpressCreate'
import ExpressDelete from './views/express/ExpressDelete'

import LoadingFn from './components/LoadingFn'

import Info from './views/Info'

import { useDispatch } from 'react-redux'
import { login } from './redux/userSlice'

import { Helmet } from 'react-helmet'
import Settings from './views/Settings'

export const baseURL = 'https://vercel-server-weliveapp.vercel.app'
// export const baseURL = 'http://localhost:8000'

function App() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

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
          dispatch(
            login({
              username: data.username,
              role: data.role,
              name: data.name,
              email: data.email,
              picture: data.picture,
              token: token,
            })
          )
          setLoading(false)
        })
        .catch((err) => {
          toast.error('token หมดอายุ :', err)
          setLoading(false)
          navigate('/login')
        })
    } else {
      setLoading(false)
    }
  }, [token])

  if (loading) {
    return <LoadingFn />
  }

  return (
    <React.Fragment>
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
        <Route path="/auth/login" element={<LoginFB />} />
        <Route path="/login" element={<LoginV1 />} />
        <Route path="/order/:id" element={<CustomerByOrder />} />

        {/* Admin */}
        <Route
          path="/settings"
          element={
            <AdminRoute>
              <Settings />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <UserHome />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/stock"
          element={
            <AdminRoute>
              <ProductStock />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/product-graph/:id"
          element={
            <AdminRoute>
              <ProductGraph />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/daily-stock"
          element={
            <AdminRoute>
              <DailyStock />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/daily-stock/create"
          element={
            <AdminRoute>
              <DailyCreate />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/daily-stock/edit/:id"
          element={
            <AdminRoute>
              <DailyEdit />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/daily-stock/history"
          element={
            <AdminRoute>
              <DailyStockHistory />
            </AdminRoute>
          }
        />
        <Route
          path="/search/customer"
          element={
            <AdminRoute>
              <CustomerSearch />
            </AdminRoute>
          }
        />
        <Route
          path="/customer/edit/:id"
          element={
            <AdminRoute>
              <CustomerEdit />
            </AdminRoute>
          }
        />
        <Route
          path="/search/order"
          element={
            <AdminRoute>
              <SaleOrderSearch />
            </AdminRoute>
          }
        />
        <Route
          path="/express"
          element={
            <AdminRoute>
              <ExpressList />
            </AdminRoute>
          }
        />
        <Route
          path="/express/create"
          element={
            <AdminRoute>
              <ExpressCreate />
            </AdminRoute>
          }
        />
        <Route
          path="/express/delete"
          element={
            <AdminRoute>
              <ExpressDelete />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/checkout"
          element={
            <AdminRoute>
              <SaleOrderCheckout />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/sales"
          element={
            <AdminRoute>
              <SaleOrder />
            </AdminRoute>
          }
        />
        {/* Manage User */}
        <Route
          path="/admin/manage"
          element={
            <AdminRoute>
              <UserManage />
            </AdminRoute>
          }
        />
        {/* --------------- */}
        <Route
          path="/order"
          element={
            <AdminRoute>
              <SaleOrderList />
            </AdminRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <AdminRoute>
              <SaleOrderReport />
            </AdminRoute>
          }
        />
        <Route
          path="/info"
          element={
            <AdminRoute>
              <Info />
            </AdminRoute>
          }
        />
      </Routes>
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

export default App
