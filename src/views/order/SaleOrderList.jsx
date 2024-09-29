import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import { styled } from '@mui/material/styles'

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
  const filteredOrders = ordersWithTotals.filter(
    (order) => !order.complete && !order.isDelete
  )

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

      <div className="position-relative">
        <div className="m-3">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>รายการที่</strong>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order, index) => (
                  <StyledTableRow key={order._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Link
                        to={`/order/${order._id}`}
                        state={{ _id: order._id }}
                        target="_blank"
                      >
                        {order.name}
                      </Link>
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
                      {order.isPayment ? (
                        <p className="text-success">ชำระเงินแล้ว</p>
                      ) : (
                        <p className="text-danger">ยังไม่ชำระเงิน</p>
                      )}
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
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
