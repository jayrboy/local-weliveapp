import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { MdArrowDropDown } from 'react-icons/md'
import { MdOutlineSearch } from 'react-icons/md'

import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import { styled } from '@mui/material/styles'
import { Button, IconButton } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'
import { Tooltip, Typography } from '@mui/material'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export default function SaleOrderSearch() {
  let { orders } = useSelector((store) => store.saleOrder)

  // State for search criteria
  const [searchDate, setSearchDate] = useState('')
  const [customerName, setCustomerName] = useState('')

  // Calculate totals for quantity and price
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

  // Filter orders based on search criteria
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.updatedAt)
    const formattedDate = `${orderDate.getFullYear()}-${String(
      orderDate.getMonth() + 1
    ).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}`

    const matchesDate = searchDate ? formattedDate === searchDate : true

    const matchesCustomerName = customerName
      ? new RegExp(`^${customerName.split('').join('.*')}`, 'i').test(
          order.name
        )
      : true

    return matchesDate && matchesCustomerName
  })

  const ordersWithTotals = calculateTotals(filteredOrders)

  const handleSearch = (e) => {
    e.preventDefault()
    // This is where the filtering is already applied
  }

  return (
    <>
      <div className="row m-3">
        <div className="col-lg-12">
          <h3 className="text-start">
            <Link to="/admin/home" className="text-decoration-none">
              WE LIVE |
            </Link>{' '}
            <span className="text-success"> ค้นหาคำสั่งซื้อ </span>
          </h3>
        </div>
      </div>

      <div className="position-relative m-3">
        <form onSubmit={handleSearch}>
          <div className="d-flex mb-1 justify-content-end">
            <input
              type="date"
              className="form-control form-control-sm ms-1"
              style={{ width: '150px' }}
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <input
              type="text"
              className="form-control form-control-sm ms-1"
              style={{ width: '150px' }}
              placeholder="ชื่อลูกค้า"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            &nbsp;
            <Button type="submit" variant="contained">
              <MdOutlineSearch />
            </Button>
          </div>
        </form>
        <TableContainer component={Paper}>
          <Table>
            <caption className="ms-3">
              <small> พบข้อมูลทั้งหมด {ordersWithTotals.length} รายการ</small>
            </caption>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>วันที่</strong>
                </TableCell>
                <TableCell>
                  <strong>ชื่อ Facebook</strong>
                </TableCell>
                <TableCell>
                  <strong>ชื่อลูกค้า</strong>
                </TableCell>
                <TableCell>
                  <strong>จำนวน</strong>
                </TableCell>
                <TableCell>
                  <strong>ราคารวม (฿)</strong>
                </TableCell>
                <TableCell>
                  <strong>สถานะ</strong>
                </TableCell>
                <TableCell>
                  <strong>เลขพัสดุสินค้า</strong>
                </TableCell>
                <TableCell>
                  <strong>ขนส่ง</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordersWithTotals.map((order) => {
                let udt = new Date(Date.parse(order.updatedAt))
                let udf = `${udt.getDate()}-${
                  udt.getMonth() + 1
                }-${udt.getFullYear()}`
                return (
                  <StyledTableRow key={order._id}>
                    <TableCell>{udf}</TableCell>
                    <TableCell>
                      <Link
                        to={`/order/${order._id}`}
                        state={{ _id: order._id }}
                        target="_blank"
                      >
                        {order.nameFb}
                      </Link>
                    </TableCell>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>
                      {order.totalQuantity
                        .toFixed(0)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                    </TableCell>
                    <TableCell>
                      {order.totalPrice
                        .toFixed(0)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                    </TableCell>
                    <TableCell>
                      {order.sended ? (
                        <p className="text-success">ส่งสินค้าแล้ว</p>
                      ) : order.isDelete ? (
                        <p className="text-danger">ปฏิเสธ/หมดเวลา</p>
                      ) : (
                        <Typography
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'center',
                          }}
                        >
                          <span className="text-warning">
                            รอแพ็คสินค้า/จัดส่ง
                          </span>
                          &nbsp;
                          <Tooltip title="กรุณาแนบเลขพัสดุที่ออเดอร์ลูกค้า">
                            <ErrorIcon color="warning" />
                          </Tooltip>
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{order.express}</TableCell>
                    <TableCell>
                      <select className="btn btn-sm btn-outline-secondary">
                        <option>เลือกขนส่ง</option>
                        <option>J&T</option>
                        <option>Shoppee</option>
                        <option>Flash</option>
                        <option>EMS</option>
                      </select>
                    </TableCell>
                  </StyledTableRow>
                )
              })}
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
