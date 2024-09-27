import React, { useEffect, useState } from 'react'
import Logo from '../assets/logo.png'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'

import { Link, useNavigate } from 'react-router-dom'

import LoginIcon from '@mui/icons-material/Login'

import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/userSlice'
import { nanoid } from 'nanoid'

const pages = [
  {
    id: nanoid(),
    title: 'หน้าหลัก',
    icon: '',
    href: '/',
  },
  {
    id: nanoid(),
    title: 'นโยบาย',
    icon: '',
    href: '/policy',
  },
  {
    id: nanoid(),
    title: 'ข้อกำหนดของบริการ',
    icon: '',
    href: '/term',
  },
]

const linkAuth = [
  {
    id: nanoid(),
    title: 'Login / Register',
    icon: <LoginIcon />,
    href: '/login',
    // href: '/auth/login',
  },
]

const settings = [
  // {
  //   id: nanoid(),
  //   title: 'Profile',
  //   icon: '',
  //   href: '/profile',
  // },
  {
    id: nanoid(),
    title: 'Logout',
    icon: '',
    href: '#',
  },
]

const ResponsiveAppBar = () => {
  const { user } = useSelector((state) => state.user)
  // console.log('ResponsiveAppBar', user)
  // console.log('profile_picture', user.picture[0].data.url)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {}, [navigate])

  const onClickLogout = () => {
    dispatch(logout())
    handleCloseUserMenu()
    navigate('/')
  }

  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <AppBar
      position="static"
      style={{ backgroundColor: '#EDE7F6', boxShadow: 'none' }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo and Business Name */}
          <Typography
            variant="h6"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'white', // สีตัวอักษรเป็นสีขาว
              textDecoration: 'none',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  transform: 'scale(0.9)', // ขยายโลโก้เมื่อวางเมาส์เหนือ
                  transition: 'transform 0.3s', // เพิ่มการเปลี่ยนแปลงที่นุ่มนวล
                },
              }}
            >
              <Avatar alt="logo" src={Logo} sx={{ mr: 1 }} />
              WE Live
            </Box>
          </Typography>

          {/* Mobile Menu */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="default"
            >
              <MenuIcon />
              {/* Hamburger Button */}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((p) => (
                <MenuItem key={p.id} onClick={handleCloseNavMenu}>
                  <Link
                    to={p.href}
                    style={{ textDecoration: 'none', width: '100%' }}
                  >
                    <Typography textAlign="center">{p.title}</Typography>
                  </Link>
                </MenuItem>
              ))}
              {user.length == 0 && (
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link
                    to="/auth/login"
                    style={{ textDecoration: 'none', width: '100%' }}
                  >
                    <Typography textAlign="center">Login / Register</Typography>
                  </Link>
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((p, i) => (
              <Link key={i} to={p.href} style={{ textDecoration: 'none' }}>
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'black', mr: 5 }}
                >
                  {p.title}
                </Button>
              </Link>
            ))}
          </Box>

          {/* Authenticated User Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {user.length == 0 &&
              linkAuth.map((page, index) => (
                <Link
                  key={index}
                  to={page.href}
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{
                      my: 2,
                      color: 'black',
                      mr: 2,
                    }}
                    startIcon={page.icon}
                  >
                    {page.title}
                  </Button>
                </Link>
              ))}
          </Box>

          {/* User Menu */}
          {user.role && (
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ color: 'gray', mr: 2 }}>
                Welcome, {user.name}
              </Typography>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="profile_picture"
                    src={user.picture[0].data.url}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting, index) => (
                  <MenuItem
                    key={index}
                    onClick={
                      setting.title === 'Logout'
                        ? onClickLogout
                        : handleCloseUserMenu
                    }
                  >
                    <Link to={setting.href} style={{ textDecoration: 'none' }}>
                      <Typography textAlign="center">
                        {setting.title}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default ResponsiveAppBar
