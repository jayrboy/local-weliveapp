import { baseURL } from '../../App'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import {
  Paper,
  Grid,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  styled,
  Button,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  FormControl,
  InputLabel,
} from '@mui/material'

import ErrorIcon from '@mui/icons-material/Error'
import SearchIcon from '@mui/icons-material/Search'
import PrintIcon from '@mui/icons-material/Print'
import DownloadIcon from '@mui/icons-material/Download'
import RateReviewIcon from '@mui/icons-material/RateReview'

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
  console.log(customerName)

  const downloadPDF = (orderId) => {
    try {
      const url = `${baseURL}/api/sale-order/download-pdf/${orderId}`
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `order-${orderId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      toast.error('Error downloading PDF')
    }
  }

  const printPDF = (orderId) => {
    const url = `${baseURL}/api/sale-order/print-pdf/${orderId}`
    const newWindow = window.open(url, '_blank')
    if (newWindow) {
      newWindow.onload = () => {
        newWindow.focus()
        newWindow.print()
      }
    } else {
      toast.error('Error opening new window for printing')
    }
  }

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
        <form onSubmit={handleSearch} className="mb-1">
          <Grid container spacing={2}>
            <Grid item>
              <FormControl fullWidth>
                <TextField
                  type="date"
                  label="วันที่สั่งซื้อ"
                  size="small"
                  value={searchDate}
                  className="form-control form-control-sm"
                  style={{ width: '150px' }}
                  onChange={(e) => setSearchDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <TextField
                  label="ค้นหาชื่อลูกค้า"
                  size="small"
                  type="text"
                  value={customerName}
                  className="form-control form-control-sm"
                  style={{ width: '150px' }}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>
        </form>
        <TableContainer component={Paper}>
          <Table>
            <caption className="ms-3">
              <small> พบข้อมูลทั้งหมด {ordersWithTotals.length} รายการ</small>
            </caption>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontWeight: 'bold' }}>วันที่</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    ชื่อ Facebook
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    ชื่อลูกค้า
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 'bold' }}>จำนวน</Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap sx={{ fontWeight: 'bold' }}>
                    ยอดขำระ (฿)
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 'bold' }}>สถานะ</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    เลขพัสดุสินค้า
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap sx={{ fontWeight: 'bold' }}>
                    จัดการ
                  </Typography>
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
                    <TableCell>
                      <Typography noWrap>{udf}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap>
                        <Link
                          to={`/order/${order._id}`}
                          state={{ _id: order._id }}
                          target="_blank"
                        >
                          {order.nameFb}
                        </Link>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap>{order.name}</Typography>
                    </TableCell>
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
                        <Typography noWrap className="text-success">
                          ส่งสินค้าแล้ว
                        </Typography>
                      ) : order.isDelete ? (
                        <Typography noWrap className="text-danger">
                          ปฏิเสธ/หมดเวลา
                        </Typography>
                      ) : (
                        <>
                          {order.isPayment ? (
                            <Typography
                              noWrap
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
                          ) : (
                            <Typography
                              noWrap
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textAlign: 'center',
                              }}
                            >
                              <span className="text-secondary">
                                ยังไม่ชำระเงิน
                              </span>
                            </Typography>
                          )}
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography noWrap>{order.express}</Typography>
                    </TableCell>
                    <TableCell>
                      {order.complete ? (
                        <>
                          <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            onClick={() => downloadPDF(order._id)}
                            size="small"
                          >
                            <DownloadIcon />
                          </Button>
                          &nbsp;
                          <Button
                            type="button"
                            variant="contained"
                            color="inherit"
                            onClick={() => printPDF(order._id)}
                            size="small"
                          >
                            <PrintIcon />
                          </Button>
                        </>
                      ) : order.isPayment ? (
                        <Link
                          to={`/order/${order._id}`}
                          state={{ _id: order._id }}
                          target="_blank"
                        >
                          <Button
                            type="button"
                            variant="contained"
                            color="warning"
                            size="small"
                          >
                            <RateReviewIcon />
                          </Button>
                        </Link>
                      ) : (
                        <></>
                      )}
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
