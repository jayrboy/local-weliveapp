import { useState } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { Avatar, Box, IconButton, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// icon
import DashboardIcon from '@mui/icons-material/Dashboard'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import TableViewIcon from '@mui/icons-material/TableView'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch'
import StorefrontIcon from '@mui/icons-material/Storefront'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import EqualizerIcon from '@mui/icons-material/Equalizer'
import InfoIcon from '@mui/icons-material/Info'
import CommentIcon from '@mui/icons-material/Comment'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'

import { login } from '../redux/userSlice'

import { Button } from '@mui/material'
import { FaFacebook } from 'react-icons/fa'

const SideBar = () => {
  const { user } = useSelector((state) => state.user)
  const [isCollapsed, setisCollapsed] = useState(true)
  const [toggled, setToggled] = useState(false)
  const [broken, setBroken] = useState(false)
  const navigate = useNavigate()

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
      }}
    >
      <Sidebar
        collapsed={isCollapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        breakPoint="ms"
        style={{ height: '100%' }}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <div style={{ flex: 1, marginBottom: '32px' }}>
            <Menu iconShape="square">
              {/* LOGO */}
              <MenuItem
                onClick={() => setisCollapsed(!isCollapsed)}
                icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                style={{
                  margin: '10px 0 20px 0',
                }}
              >
                {!isCollapsed && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    ml="15px"
                  >
                    <Typography>WE LIVE APP</Typography>
                    <IconButton onClick={() => setisCollapsed(!isCollapsed)}>
                      <MenuOutlinedIcon />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>

              {!isCollapsed && (
                <Box mb="25px">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Avatar
                      alt="profile-picture"
                      width="50px"
                      src={user.picture[0].data.url}
                      sx={{ width: 56, height: 56 }}
                      // style={{
                      //   cursor: 'pointer',
                      //   borderRadius: '50%',
                      // }}
                    />
                  </Box>
                  <Box textAlign="center">
                    <Typography sx={{ m: '10px 0 0 0' }}>
                      {user.name}
                    </Typography>
                  </Box>
                </Box>
              )}

              <MenuItem
                icon={<DashboardIcon />}
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </MenuItem>

              <SubMenu icon={<MapOutlinedIcon />} label="ทรัพย์สิน">
                <MenuItem
                  icon={<TableViewIcon />}
                  onClick={() => navigate('/stock')}
                >
                  สินค้า
                </MenuItem>

                <MenuItem
                  icon={<ShoppingCartIcon />}
                  onClick={() => navigate('/sale-daily')}
                >
                  ขาย
                </MenuItem>
              </SubMenu>

              <SubMenu label="ร้านค้า" icon={<StorefrontIcon />}>
                <MenuItem
                  icon={<AccountBalanceIcon />}
                  onClick={() => navigate('/bookbank')}
                >
                  บัญชีธนาคาร
                </MenuItem>

                <MenuItem
                  icon={<LocalShippingIcon />}
                  onClick={() => navigate('/express')}
                >
                  ตั้งค่าราคาขนส่ง
                </MenuItem>

                <MenuItem
                  icon={<CommentIcon />}
                  onClick={() => navigate('/order')}
                >
                  <span className=" text-success">คำสั่งซื้อ</span>
                </MenuItem>

                <MenuItem
                  icon={<ContentPasteSearchIcon />}
                  onClick={() => navigate('/order/search')}
                >
                  ค้นหาคำสั่งซื้อ
                </MenuItem>

                <MenuItem
                  icon={<PersonSearchOutlinedIcon />}
                  onClick={() => navigate('/customer/search')}
                >
                  ค้นหาลูกค้า
                </MenuItem>

                <MenuItem
                  icon={<CallMissedOutgoingIcon />}
                  onClick={() => navigate('/checkout')}
                >
                  <span className=" ">เช็คเอาท์</span>
                </MenuItem>
                {/* <MenuItem
                  icon={<PaidOutlinedIcon />}
                  onClick={() => navigate('/sales')}
                >
                  <span className=" text-success">ยอดขาย</span>
                </MenuItem> */}
              </SubMenu>

              {/* Mange Admin & User */}
              {user.role === 'admin' ? (
                <SubMenu label="Admin" icon={<AdminPanelSettingsIcon />}>
                  <MenuItem
                    icon={<PeopleOutlinedIcon />}
                    onClick={() => navigate('/admin/manage')}
                  >
                    Users
                  </MenuItem>
                  {/* <MenuItem
                  icon={<AdminPanelSettingsIcon />}
                  onClick={() => navigate('#')}
                >
                  Admin
                </MenuItem> */}
                </SubMenu>
              ) : (
                <></>
              )}
            </Menu>

            <div
              style={{
                padding: '0 24px',
                marginBottom: '8px',
                marginTop: '32px',
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                style={{
                  opacity: isCollapsed ? 0 : 0.5,
                  letterSpacing: '0.5px',
                }}
              >
                Extra
              </Typography>
            </div>

            <Menu>
              {/* <MenuItem icon={<CalendarTodayOutlinedIcon />}>Calendar</MenuItem> */}
              {/* <MenuItem icon={<ReceiptOutlinedIcon />}>Documentation</MenuItem> */}
              <MenuItem
                icon={<EqualizerIcon />}
                onClick={() => navigate('/analysis')}
              >
                <span className="text-success">รายงานสรุปยอด</span>
              </MenuItem>
              <MenuItem icon={<InfoIcon />} onClick={() => navigate('/info')}>
                วิธีการใช้งาน
              </MenuItem>
            </Menu>

            {/* Update History */}
            <div
              style={{
                padding: '0 24px',
                marginBottom: '8px',
                marginTop: '32px',
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                style={{
                  opacity: isCollapsed ? 0 : 0.5,
                  letterSpacing: '0.5px',
                }}
              >
                มีอะไรใหม่ !
              </Typography>
            </div>

            <Menu>
              <MenuItem
                icon={<AutoFixHighIcon />}
                onClick={() => navigate('/news')}
              >
                ประวัติการอัปเดต
              </MenuItem>
            </Menu>
          </div>
        </div>
      </Sidebar>
      {/* <main>
        <div style={{ padding: '16px 2px ', color: '#44596e' }}>
          <div style={{ marginBottom: '16px' }}>
            {broken && (
              <IconButton onClick={() => setToggled(!toggled)}>
                <MenuOutlinedIcon />
              </IconButton>
            )}
          </div>
        </div>
      </main> */}
    </div>
  )
}
export default SideBar
