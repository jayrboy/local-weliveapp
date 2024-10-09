import logo from '../assets/logo-we.png'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  Badge,
  styled,
} from '@mui/material'

import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import { RiLiveFill } from 'react-icons/ri'

import { useSelector, useDispatch } from 'react-redux'
import { getOrders } from '../redux/saleOrderSlice'
import { logout } from '../redux/userSlice'
import { openModal } from '../redux/liveSlice'

import GetComments from '../components/GetComments'
import { toggleTheme } from '../redux/themeSlice'

export default function HeaderBar() {
  let { orders } = useSelector((store) => store.saleOrder)
  let { user } = useSelector((store) => store.user)
  let { isLoading } = useSelector((store) => store.live)
  let themeMode = useSelector((store) => store.theme.mode)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getOrders())
  }, [])

  const onClickLogout = () => {
    dispatch(logout())
    handleClose()
    navigate('/auth/login')
    // navigate('/login')
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
      <Box
        display="flex"
        alignItems="center"
        sx={{
          display: 'flex',
          alignItems: 'center',
          '&:hover': {
            transform: 'scale(0.95)', // ขยายโลโก้เมื่อวางเมาส์เหนือ
            transition: 'transform 0.2s ease-in-out', // เพิ่มการเปลี่ยนแปลงที่นุ่มนวล
          },
        }}
      >
        <img
          src={logo}
          alt="Logo"
          width="40px"
          style={{ borderRadius: '50%' }}
        />
        <Typography
          component="h1"
          variant="subtitle1" // ปรับให้ตัวอักษรขนาดเล็กลงเพื่อไม่ให้เด่นเกินไป
          color="textSecondary" // ใช้สีเทาเพื่อให้ไม่เด่นมากเกินไป
          noWrap
          sx={{
            flexGrow: 1,
            fontWeight: 500, // เพิ่มความหนาเล็กน้อย
            marginLeft: 1, // เพิ่มช่องว่างระหว่างโลโก้และเวอร์ชัน
            letterSpacing: '0.05em', // เพิ่มระยะห่างระหว่างตัวอักษรเพื่อความเรียบง่าย
          }}
        >
          v1.0
        </Typography>
      </Box>

      <Box display="flex">
        {/* Live Video Icon */}
        <IconButton onClick={() => dispatch(openModal())}>
          {isLoading ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <RiLiveFill color="red" />
              {/* Set Interval for Real-time  */}
              {/* <GetComments /> */}
            </StyledBadge>
          ) : (
            <RiLiveFill />
          )}
        </IconButton>

        {/* Cart Icon */}
        <IconButton onClick={() => navigate('/order')}>
          <CartIcon />
          <div className="amount-container">
            <p className="total-amount">
              {
                orders.filter((order) => !order.complete && !order.isDelete)
                  .length
              }
            </p>
          </div>
        </IconButton>

        {/* Theme Icon */}
        <IconButton onClick={() => dispatch(toggleTheme())}>
          {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>

        {/* Person Icon */}
        <IconButton onClick={handleMenu}>
          <Avatar
            alt="User Profile"
            src={user.picture[0].data.url}
            sx={{ width: 34, height: 34 }}
          />
        </IconButton>
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
          <MenuItem
            onClick={() => {
              handleClose()
              navigate('/profile')
            }}
          >
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose()
              navigate('/info')
            }}
          >
            วิธีการใช้งาน
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose()
              navigate('/app/policy')
            }}
          >
            นโยบาย
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose()
              navigate('/app/term')
            }}
          >
            ข้อกำหนดของบริการ
          </MenuItem>
          <MenuItem onClick={onClickLogout}>Logout</MenuItem>
        </Menu>
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

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: 'red',
    color: 'red',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))
