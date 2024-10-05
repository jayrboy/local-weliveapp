import { baseURL } from '../../App'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
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
  Box,
} from '@mui/material'

import { MdGrid3X3, MdOutlineSearch } from 'react-icons/md'
import PrintIcon from '@mui/icons-material/Print'
import DownloadIcon from '@mui/icons-material/Download'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export default function SaleOrderCheckout() {
  let { orders } = useSelector((store) => store.saleOrder)

  // State for search fields
  const [searchDate, setSearchDate] = useState('')
  const [searchOrderId, setSearchOrderId] = useState('')
  const [searchTracking, setSearchTracking] = useState('')

  useEffect(() => {}, [orders])

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

  // Filter orders based on search fields
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt)
    const formattedDate = `${orderDate.getFullYear()}-${String(
      orderDate.getMonth() + 1
    ).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}`

    const matchesDate = searchDate ? formattedDate === searchDate : true
    const matchesOrderId = searchOrderId
      ? order._id.includes(searchOrderId)
      : true
    const matchesTracking = searchTracking
      ? order.express.includes(searchTracking)
      : true

    return (
      order.complete &&
      order.sended &&
      !order.isDelete &&
      matchesDate &&
      matchesOrderId &&
      matchesTracking
    )
  })

  return (
    <>
      <div className="row m-3">
        <div className="col-lg-12">
          <h3 className="text-start">
            <Link to="/admin/home" className="text-decoration-none">
              WE LIVE |
            </Link>{' '}
            <span className="text-success"> Checkout</span>
          </h3>
        </div>
      </div>

      <div className="position-relativ m-3">
        <form className="mb-1">
          <Grid container spacing={2}>
            <Grid item>
              <FormControl fullWidth>
                <TextField
                  type="date"
                  label="วันที่สั่งซื้อ"
                  value={searchDate}
                  size="small"
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
                  className="form-control form-control-sm "
                  type="text"
                  label="เลขออเดอร์"
                  style={{ width: '150px' }}
                  size="small"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <TextField
                  className="form-control form-control-sm "
                  type="text"
                  label="เลขพัสดุ"
                  style={{ width: '150px' }}
                  size="small"
                  value={searchTracking}
                  onChange={(e) => setSearchTracking(e.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>
        </form>

        <TableContainer component={Paper}>
          <Table>
            <caption className="ms-3">
              <small> พบข้อมูลทั้งหมด {filteredOrders.length} รายการ</small>
            </caption>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Order ID</strong>
                </TableCell>
                <TableCell>
                  <strong>วันที่สั่งซื้อ</strong>
                </TableCell>
                <TableCell>
                  <strong>ชื่อ Facebook</strong>
                </TableCell>
                <TableCell>
                  <strong>เลขพัสดุ</strong>
                </TableCell>
                <TableCell>
                  <strong>วันที่เช็คเอ้าท์</strong>
                </TableCell>
                <TableCell>
                  <strong className="text-success">อนุมัติโดย</strong>
                </TableCell>
                <TableCell>
                  <strong>พิมพ์ใบเสร็จ/ใบปะหน้าพัสดุ</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => {
                let dt = new Date(Date.parse(order.createdAt))
                let df = `${dt.getDate()}-${
                  dt.getMonth() + 1
                }-${dt.getFullYear()}`

                let udt = new Date(Date.parse(order.updatedAt))
                let udf = `${udt.getDate()}-${
                  udt.getMonth() + 1
                }-${udt.getFullYear()}`

                return (
                  <StyledTableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{df}</TableCell>
                    <TableCell>
                      <Link
                        to={`/order/${order._id}`}
                        state={{ _id: order._id }}
                        target="_blank"
                      >
                        {order.nameFb}
                      </Link>
                    </TableCell>
                    <TableCell>{order.express}</TableCell>
                    <TableCell>{udf}</TableCell>
                    <TableCell>{order.updateBy}</TableCell>
                    <TableCell>
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
