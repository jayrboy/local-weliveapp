import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'

import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  styled,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'

import FilterListIcon from '@mui/icons-material/FilterList'
import ErrorIcon from '@mui/icons-material/Error'
import { Tooltip, Typography } from '@mui/material'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'

import { MdGrid3X3 } from 'react-icons/md'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export default function SaleOrderList() {
  let { orders } = useSelector((store) => store.saleOrder)
  const [anchorEl, setAnchorEl] = useState(null)
  const [filterStatus, setFilterStatus] = useState(null) // สำหรับเก็บสถานะที่กรอง
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleFilter = (filterValue) => {
    setFilterStatus(filterValue) // เซ็ตค่าสถานะที่ต้องการกรอง
    handleClose()
  }

  // ฟังก์ชันคำนวณจำนวนสินค้าและราคารวมในแต่ละออเดอร์
  const calculateTotals = (orders) => {
    return orders.map((order) => {
      const totalQuantity = order.orders.reduce(
        (total, item) => total + item.quantity,
        0
      )
      const totalPrice = order.orders.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
      return {
        ...order,
        totalQuantity,
        totalPrice,
      }
    })
  }

  const ordersWithTotals = calculateTotals(orders)

  // ฟิลเตอร์คำสั่งซื้อตามสถานะที่กรอง
  const filteredOrders = ordersWithTotals.filter((order) => {
    if (filterStatus === 'Active') return order.isPayment && !order.isDelete
    if (filterStatus === 'Inactive') return !order.isPayment && !order.isDelete
    return !order.complete && !order.isDelete
  })

  return (
    <>
      <div className="row m-3">
        <div className="col-lg-6">
          <h3 className="text-start">
            <Link to="/dashboard" className="text-decoration-none">
              SALE ORDER |
            </Link>
            <span className="text-success"> รายการคำสั่งซื้อ</span>
          </h3>
        </div>
      </div>

      <div className="position-relative m-3">
        <TableContainer component={Paper}>
          <Table>
            <caption className="ms-3">
              <small>พบข้อมูลทั้งหมด {filteredOrders.length} รายการ</small>
            </caption>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>
                    <MdGrid3X3 />
                  </strong>
                </TableCell>
                <TableCell>
                  <strong>ชื่อ Facebook</strong>
                </TableCell>
                <TableCell className="text-center">
                  <strong>จำนวน</strong>
                </TableCell>
                <TableCell className="text-center">
                  <Typography noWrap>
                    <strong>ราคารวม (฿)</strong>
                  </Typography>
                </TableCell>
                <TableCell>
                  <strong>สถานะ</strong>
                  <IconButton onClick={handleClick}>
                    <FilterListIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                  >
                    <MenuItem onClick={() => handleFilter('Active')}>
                      ชำระเงินแล้ว
                    </MenuItem>
                    <MenuItem onClick={() => handleFilter('Inactive')}>
                      ยังไม่ชำระเงิน
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order, index) => (
                <StyledTableRow key={order._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Tooltip title="คลิกเพื่อดูรายละเอียดออเดอร์">
                      <Link
                        to={`/order/${order._id}`}
                        state={{ _id: order._id }}
                        target="_blank"
                      >
                        <Typography noWrap>{order.nameFb}</Typography>
                      </Link>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center">
                    {order.totalQuantity
                      .toFixed(0)
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                  </TableCell>
                  <TableCell className="text-center">
                    {order.totalPrice
                      .toFixed(0)
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                  </TableCell>
                  <TableCell>
                    {order.isPayment ? (
                      <Typography noWrap>
                        <span className="text-secondary">ชำระเงินแล้ว</span>
                        &nbsp;
                        <Tooltip title="กรุณายืนยันการชำระเงิน">
                          <ErrorIcon color="warning" />
                        </Tooltip>
                      </Typography>
                    ) : (
                      <Typography noWrap className="text-warning">
                        ยังไม่ชำระเงิน
                      </Typography>
                    )}
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <Link to="/dashboard" className="btn btn-light btn-sm">
          หน้าหลัก
        </Link>
      </div>
    </>
  )
}
