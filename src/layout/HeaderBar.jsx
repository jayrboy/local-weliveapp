import logo from '../assets/logo-we.png'

import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'

import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import { RiLiveFill } from 'react-icons/ri'

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../redux/userSlice'

import { openModal } from '../redux/liveVideoModalSlice'
import { firstLoadContext } from '../routes/AdminRoute'

export default function HeaderBar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  let [firstLoad, setFirstLoad] = useContext(firstLoadContext)

  const onClickLogout = () => {
    dispatch(logout())
    handleClose()
    navigate('/')
  }

  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* Logo */}
      <Box display="flex" alignItems="center">
        <img
          src={logo}
          alt="Logo"
          width="40px"
          style={{ borderRadius: '50%' }}
        />
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        ></Typography>
      </Box>

      {/* icons */}
      <Box display="flex">
        <IconButton onClick={() => dispatch(openModal())}>
          {firstLoad ? <RiLiveFill color="red" /> : <RiLiveFill color="grey" />}
        </IconButton>
        <IconButton>
          <CartIcon />
          <div className="amount-container">
            <p className="total-amount">{'0'}</p>
          </div>
        </IconButton>
        <IconButton onClick={handleMenu}>
          <PersonOutlinedIcon />
        </IconButton>

        <IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={onClickLogout}>Logout</MenuItem>
          </Menu>
        </IconButton>
      </Box>
    </Box>
  )
}

export const CartIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 "
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      width="25px"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  )
}
