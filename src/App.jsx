/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'

import { CssBaseline } from '@mui/material'

import Register from './components/pages/Register'
import Login from './components/pages/Login'
import AdminRoute from './routes/AdminRoute'
import UserRoute from './routes/UserRoute'
import NotFound from './components/pages/NotFound'

import HomeUser from './components/pages/user/HomeUser'
import HomeAdmin from './components/pages/admin/AdminHome'

import AdminStock from './components/pages/admin/AdminStock'
import DBCreate from './components/pages/admin/DBCreate'
import DBUpdate from './components/pages/admin/DBUpdate'
import DBDelete from './components/pages/admin/DBDelete'
import DBCart from './components/pages/admin/DBCart'
import DBOrder from './components/pages/admin/DBOrder'
import DBCFCode from './components/pages/admin/DBCFCode'
import ADinvoice from './components/pages/admin/ADinvoice'
import ADexpress from './components/pages/admin/EXcreate'
import ADSales from './components/pages/admin/ADSales'
import ADSeacrh from './components/pages/admin/ADSearch'
import SearchbyOrder from './components/pages/admin/SearchbyOrder'
import ManageUser from './components/pages/admin/ManageUser'
import ADCheckout from './components/pages/admin/ADcheckout'

import ResponsiveAppBar from './components/layout/ResponsiveAppBar'
import USorder from './components/pages/user/USorder'
import USinvoice from './components/pages/user/USinvoice'

import { useDispatch } from 'react-redux'
import { login } from './redux/userSlice'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import EXcreate from './components/pages/admin/EXcreate'
import EXupdate from './components/pages/admin/EXupdate'
import EXdelete from './components/pages/admin/EXdelete'

export const baseURL = 'https://vercel-server-weliveapp.vercel.app'

function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userToken = localStorage.getItem('token')

    if (userToken) {
      const axiosFetch = (authToken) =>
        axios
          .post(
            `${baseURL}/api/current-user`,
            {},
            {
              headers: { authToken },
            }
          )
          .then((result) => {
            dispatch(
              login({
                username: result.data.username,
                role: result.data.role,
                name: result.data.name,
                email: result.data.email,
                picture: result.data.picture,
                token: authToken,
              })
            )
            setLoading(false)
          })
          .catch((err) => {
            alert(err)
            setLoading(false)
          })

      axiosFetch(userToken)
    } else {
      setLoading(false)
    }
  }, [dispatch])

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading..</span>
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <ToastContainer position="top-center" autoClose={1000} />

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
              <HomeUser />
            </>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* User */}
        <Route
          path="/user/home"
          element={
            <UserRoute>
              <HomeUser />
            </UserRoute>
          }
        />
        <Route
          path="/user/order"
          element={
            <UserRoute>
              <USorder />
            </UserRoute>
          }
        />
        <Route
          path="/user/invoice"
          element={
            <UserRoute>
              <USinvoice />
            </UserRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/home"
          element={
            <AdminRoute>
              <HomeAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/checkout"
          element={
            <AdminRoute>
              <ADCheckout />
            </AdminRoute>
          }
        />
        <Route
          path="/search/by-order"
          element={
            <AdminRoute>
              <SearchbyOrder />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/stock"
          element={
            <AdminRoute>
              <AdminStock />
            </AdminRoute>
          }
        />
        <Route
          path="/db/create"
          element={
            <AdminRoute>
              <DBCreate />
            </AdminRoute>
          }
        />
        <Route
          path="/db/update"
          element={
            <AdminRoute>
              <DBUpdate />
            </AdminRoute>
          }
        />
        <Route
          path="/db/delete"
          element={
            <AdminRoute>
              <DBDelete />
            </AdminRoute>
          }
        />
        <Route
          path="/db/cart"
          element={
            <AdminRoute>
              <DBCart />
            </AdminRoute>
          }
        />
        <Route
          path="/db/order"
          element={
            <AdminRoute>
              <DBOrder />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/cf-code"
          element={
            <AdminRoute>
              <DBCFCode />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/invoice"
          element={
            <AdminRoute>
              <ADinvoice />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/sales"
          element={
            <AdminRoute>
              <ADSales />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/search"
          element={
            <AdminRoute>
              <ADSeacrh />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/exupdate"
          element={
            <AdminRoute>
              <EXupdate />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/excreate"
          element={
            <AdminRoute>
              <EXcreate />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/exdelete"
          element={
            <AdminRoute>
              <EXdelete />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manage"
          element={
            <AdminRoute>
              <ManageUser />
            </AdminRoute>
          }
        />
      </Routes>
    </React.Fragment>
  )
}

export default App
