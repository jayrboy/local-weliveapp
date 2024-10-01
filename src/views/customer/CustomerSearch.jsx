import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { MdOutlineSearch } from 'react-icons/md'

import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export default function CustomerSearch() {
  let { orders, totalQuantity, totalPrice } = useSelector(
    (store) => store.saleOrder
  )

  return (
    <>
      <div className="row m-3">
        <div className="col-lg-12">
          <h3 className="text-start">
            <Link to="/admin/home" className="text-decoration-none">
              WE LIVE |
            </Link>
            <span className="text-success"> ค้นหาลูกค้า</span>
          </h3>
        </div>
      </div>

      <div className="position-relativ m-3">
        <form>
          <div className="d-flex mb-1 justify-content-end">
            <input
              type="text"
              className="form-control form-control-sm ms-1"
              placeholder="ชื่อลูกค้า"
              style={{ width: '150px' }}
            />
            <input
              type="text"
              className="form-control form-control-sm ms-1"
              placeholder="ที่อยู่"
              style={{ width: '150px' }}
            />
            <input
              type="text"
              className="form-control form-control-sm ms-1"
              placeholder=" เบอร์โทรศัพท์"
              style={{ width: '150px' }}
            />
            &nbsp;
            <Button variant="contained">
              <MdOutlineSearch />
            </Button>
          </div>
        </form>
        <TableContainer component={Paper}>
          <Table>
            <caption className="ms-3">
              <small> พบข้อมูลทั้งหมด {orders.length} รายการ</small>
            </caption>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>ชื่อลูกค้า</strong>
                </TableCell>
                <TableCell>
                  <strong>ที่อยู่</strong>
                </TableCell>
                <TableCell>
                  <strong>ตำบล/แขวง</strong>
                </TableCell>
                <TableCell>
                  <strong>อำเภอ/เขต</strong>
                </TableCell>
                <TableCell>
                  <strong>จังหวัด</strong>
                </TableCell>
                <TableCell>
                  <strong>รหัสไปรษณีย์</strong>
                </TableCell>
                <TableCell>
                  <strong>โทรศัพท์</strong>
                </TableCell>
                <TableCell>
                  <strong>สถานะ</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders &&
                orders.map((order, index) => {
                  return (
                    <React.Fragment key={index}>
                      <StyledTableRow>
                        <TableCell>
                          <Link
                            to={`/order/${order._id}`}
                            state={{ _id: order._id }}
                            target="_blank"
                          >
                            {order.name}
                          </Link>
                        </TableCell>
                        <TableCell>{order.address}</TableCell>
                        <TableCell>{order.district}</TableCell>
                        <TableCell>{order.sub_area}</TableCell>
                        <TableCell>{order.sub_district}</TableCell>
                        <TableCell>{order.postcode}</TableCell>
                        <TableCell>{order.tel}</TableCell>
                        <TableCell>
                          {order.sended ? (
                            <p className="text-success">ส่งแล้ว</p>
                          ) : order.isDelete ? (
                            <p className="text-danger">การส่งล้มเหลว</p>
                          ) : (
                            <p className="text-warning">ยังไม่ได้ส่ง</p>
                          )}
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
