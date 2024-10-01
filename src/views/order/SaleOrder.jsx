import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import { styled } from '@mui/material/styles'

import { MdOutlineSearch } from 'react-icons/md'
import { toast } from 'react-toastify'
import { baseURL } from '../../App'

function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  }
}

export default function SaleOrder() {
  let { orders, totalQuantity, totalPrice } = useSelector(
    (store) => store.saleOrder
  )

  const downloadPDF = (orderId) => {
    try {
      const url = `${baseURL}/api/sale-order/download-pdf/${orderId}`
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `order-${orderId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast(`พิมพ์ใบเสร็จ/ใบปะหน้าพัสดุขนาด A6`)
    } catch (error) {
      toast.error('Error downloading PDF')
    }
  }

  const filteredOrders = orders.filter(
    (order) => order.complete && order.sended && !order.isDelete
  )

  return (
    <>
      <div className="row m-3">
        <div className="col-lg-12">
          <h3 className="text-start">
            <Link to="/admin/home" className="  text-decoration-none">
              WE LIVE |
            </Link>
            <span className="text-success"> เช็คยอดขาย </span>
          </h3>
        </div>
      </div>

      <div className="position-relative m-3">
        <div className="d-flex mb-1 justify-content-end">
          <input
            type="date"
            className="form-control form-control-sm"
            style={{ width: '150px' }}
          />
          <button className="btn btn-sm btn-primary ms-3">
            <MdOutlineSearch />
            &nbsp;ค้นหา
          </button>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <caption className="ms-3">
              <small>
                {' '}
                พบข้อมูลทั้งหมด{' '}
                {
                  orders.filter(
                    (order) =>
                      order.complete && order.sended && !orders.isDelete
                  ).length
                }{' '}
                รายการ
              </small>
            </caption>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>#</strong>
                </TableCell>
                <TableCell>
                  <strong>วันที่</strong>
                </TableCell>
                <TableCell>
                  <strong>ออเดอร์</strong>
                </TableCell>
                <TableCell>
                  <strong>จำนวนขาย</strong>
                </TableCell>
                <TableCell>
                  <strong>ค่าส่ง</strong>
                </TableCell>
                <TableCell>
                  <strong>ส่งแล้ว/ยังไม่ส่ง</strong>
                </TableCell>
                <TableCell>
                  <strong>ยอดเงินโอนแล้ว/ยังไม่โอน</strong>
                </TableCell>
                <TableCell>
                  <strong>ยอดขาย</strong>
                </TableCell>
                <TableCell>
                  <strong>ต้นทุน</strong>
                </TableCell>
                <TableCell>
                  <strong>ค่าส่ง</strong>
                </TableCell>
                <TableCell>
                  <strong>กำไร</strong>
                </TableCell>
                <TableCell>
                  <strong>Download</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order, i) => {
                // คำนวณค่า itempr * among - discount
                let udt = new Date(Date.parse(order.updatedAt))
                let udf = (
                  <>
                    {udt.getDate()}-{udt.getMonth() + 1}-{udt.getFullYear()}
                  </>
                )

                return (
                  <React.Fragment key={order._id}>
                    <StyledTableRow>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{udf}</TableCell>
                      <TableCell>{order.nameFb}</TableCell>
                      <TableCell>{3} ชื้น</TableCell>
                      <TableCell>{3}</TableCell>
                      <TableCell>{50}</TableCell>
                      <TableCell>
                        {1} / {2}
                      </TableCell>
                      <TableCell>
                        {3} / {4}
                      </TableCell>
                      <TableCell>{1}</TableCell>
                      <TableCell>{2}</TableCell>
                      <TableCell>{3}</TableCell>
                      <TableCell>{4}</TableCell>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => downloadPDF(order._id)}
                        >
                          ดาวน์โหลด PDF
                        </button>
                      </TableCell>
                    </StyledTableRow>
                  </React.Fragment>
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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))
