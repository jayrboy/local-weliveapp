import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import axios from 'axios'
import { baseURL } from '../../../../App'
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export default function CustomerOrder() {
  const [alldata, setalldata] = useState([])
  const [user, setUser] = useState(null)
  const token = localStorage.getItem('token')
  let { orders } = useSelector((store) => store.saleOrder)
  console.log(orders)
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }

        const response = await axios.post(
          `${baseURL}/api/current-user`,
          {},
          config
        )
        setUser(response.data)
      } catch (error) {
        console.error('Error fetching current user:', error.response?.data)
      }
    }

    getCurrentUser()
  }, [token])

  useEffect(() => {
    const fetchSaleOrder = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/sale-order`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setalldata(response.data)
      } catch (error) {
        console.error('There was an error!', error)
      }
    }

    if (token && user) {
      fetchSaleOrder()
    }
  }, [token, user])

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
    <div className="position-relative mt-5">
      <div className="card">
        <div className="m-3">
          <h5>
            WeLive | <span className="text-success">สินค้าของคุณ</span>
          </h5>
          <div className="container mt-3 mx-auto">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="text-center">รายการที่</TableCell>
                    <TableCell className="text-center">ชื่อลูกค้า</TableCell>
                    <TableCell className="text-center">จำนวนสินค้า</TableCell>
                    <TableCell className="text-center">ราคารวม</TableCell>
                    <TableCell className="text-center">สถานะ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ordersWithTotals.map((order, index) => {
                    console.log(index)
                    console.log(order)
                    return (
                      <TableRow key={order._id}>
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center">
                          <Link
                            to={`/order/${order._id}`}
                            state={{ _id: order._id }}
                          >
                            {order.name}
                          </Link>
                        </TableCell>

                        <TableCell className="text-center">
                          {order.totalQuantity}
                        </TableCell>
                        <TableCell className="text-center">
                          {order.totalPrice}
                        </TableCell>
                        <TableCell className="text-center">
                          {order.complete == false ? (
                            <div>
                              <button className="btn btn-sm btn-success">
                                ยืนยันออเดอร์
                              </button>
                            </div>
                          ) : (
                            <div>
                              <button className="btn btn-sm btn-warning">
                                จัดส่งแล้ว
                              </button>
                              <button className="btn btn-sm btn-danger ms-3">
                                ยกเลิกออเดอร์
                              </button>
                            </div>
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
      </div>
    </div>
  )
}
