import React from 'react'
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

import { MdOutlineSearch } from 'react-icons/md'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export default function SaleOrder() {
  let { orders, totalQuantity, totalPrice } = useSelector(
    (store) => store.saleOrder
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
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, i) => {
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
