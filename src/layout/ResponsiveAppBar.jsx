import logo from '../assets/logo.png'
import React, { useState } from 'react'

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

const pages = [
  {
    title: 'หน้าหลัก',
    icon: '',
    to: '/',
  },
  {
    title: 'ผลิตภัณฑ์ของเรา',
    icon: '',
    to: '/service',
  },
  {
    title: 'เกี่ยวกับเรา',
    icon: '',
    to: '/about',
  },
]
const authUser = [
  {
    title: 'สินค้าในตะกร้า',
    icon: '',
    to: '/user/order',
  },
  {
    title: 'คำสั่งซื้อ',
    icon: '',
    to: '/user/invoice',
  },
]

const linkAuth = [
  {
    title: 'Login / Register',
    icon: <LoginIcon />,
    to: '/login',
  },
]

const settings = [
  {
    title: 'Profile',
    icon: '',
    to: '/profile',
  },
  {
    title: 'Logout',
    icon: '',
    to: '#',
  },
]

const ResponsiveAppBar = () => {
  const { user } = useSelector((state) => state.user)
  // console.log('ResponsiveAppBar', user)
  // console.log('profile_picture', user.picture[0].data.url)

  const dispatch = useDispatch()
  const navigate = useNavigate()

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
    <AppBar position="static" style={{ backgroundColor: '#EDE7F6' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* LOGO */}
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <IconButton>
              <Avatar alt="logo" src={logo} />
            </IconButton>
          </Typography>
          {/* /LOGO */}

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="default"
            >
              <MenuIcon />
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
              {pages.map((page, index) => (
                <MenuItem key={index} onClick={handleCloseNavMenu}>
                  <Link to={page.to} style={{ textDecoration: 'none' }}>
                    <Typography textAlign="center">{page.title}</Typography>
                  </Link>
                </MenuItem>
              ))}
              {/* Menu Mobile User Auth */}
              {user.length != 0 &&
                authUser.map((page, index) => (
                  <MenuItem key={index} onClick={handleCloseNavMenu}>
                    <Link to={page.to} style={{ textDecoration: 'none' }}>
                      <Typography textAlign="center">{page.title}</Typography>
                    </Link>
                  </MenuItem>
                ))}

              {user.length === 0 &&
                linkAuth.map((page, index) => (
                  <MenuItem key={index} onClick={handleCloseNavMenu}>
                    <Link to={page.to} style={{ textDecoration: 'none' }}>
                      <Typography textAlign="center">{page.title}</Typography>
                    </Link>
                  </MenuItem>
                ))}
            </Menu>
          </Box>
          {/* /Mobile Menu */}

          {/* LOGO Mobile */}
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <IconButton>
              <Avatar alt="logo" src={logo} />
            </IconButton>
          </Typography>
          {/* /LOGO Mobile */}

          {/* Menu Left Full */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, index) => (
              <React.Fragment key={index}>
                <Link to={page.to}>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'black', mr: 5 }}
                  >
                    {page.title}
                  </Button>
                </Link>
              </React.Fragment>
            ))}
            {/* Menu Desktop User Auth */}
            {user.length != 0 &&
              authUser.map((page, index) => (
                <React.Fragment key={index}>
                  <Link to={page.to}>
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: 'black', mr: 5 }}
                    >
                      {page.title}
                    </Button>
                  </Link>
                </React.Fragment>
              ))}
          </Box>
          {/* /Menu Left Full */}

          {/* Menu Right Full */}
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
            {user.length === 0 &&
              linkAuth.map((page, index) => (
                <React.Fragment key={index}>
                  <Link to={page.to}>
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
                </React.Fragment>
              ))}
          </Box>
          {/* /Menu Right Full */}

          {/* User Menu */}
          {user.length != 0 && (
            <Box sx={{ flexGrow: 0 }}>
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
                      setting.title == 'Logout'
                        ? onClickLogout
                        : handleCloseUserMenu
                    }
                  >
                    <Link to={setting.to} style={{ textDecoration: 'none' }}>
                      <Typography textAlign="center">
                        {setting.title}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}

          {/* /User Menu */}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default ResponsiveAppBar
