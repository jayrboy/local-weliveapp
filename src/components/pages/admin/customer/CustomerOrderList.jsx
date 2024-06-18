import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

export default function CustomerOrderList() {
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

  return (
    <>
      <div className="row m-3">
        <div className="col-lg-6">
          <h3 className="text-start">
            <Link to="/admin/home" className="  text-decoration-none">
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
                    <strong>สินค้า</strong>
                  </TableCell>
                  <TableCell>
                    <strong>จำนวนสินค้า</strong>
                  </TableCell>
                  <TableCell>
                    <strong>ราคารวม</strong>
                  </TableCell>
                  <TableCell>
                    <strong>สถานะ</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ordersWithTotals.map((order, index) => {
                  // console.log(index)
                  console.log(order)
                  return (
                    <TableRow key={order._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Link
                          to={`/order/${order._id}`}
                          state={{ _id: order._id }}
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
                        {order.complete == true ? (
                          <>
                            <p className="text-success">ชำระเงินแล้ว</p>
                          </>
                        ) : (
                          <>
                            <p className="text-danger">ยังไม่ชำระเงิน</p>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  )
}
