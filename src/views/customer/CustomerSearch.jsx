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

      <form>
        <div className="container">
          <div className="row">
            <div className="col-md-3 mb-2 d-grid justify-content-between">
              <label>ชื่อ</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="JASDAKORN AKE"
              />
            </div>
            <div className="col-md-3 mb-2 d-grid justify-content-between">
              <label>ชื่อลูกค้า</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="เจษฎากร คุ้มเดช"
              />
            </div>
            <div className="col-md-3 mb-2 d-grid justify-content-between">
              <label>ที่อยู่</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="12/345"
              />
            </div>
            <div className="col-md-3 mb-2 d-grid justify-content-between">
              <label>เบอร์โทรศัพท์</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder=" 061-xxxx-xxx "
              />
            </div>
            <div className="mt-1 text-center">
              <button className="btn btn-sm btn-primary">
                <MdOutlineSearch />
                &nbsp;ค้นหา
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="position-relativ m-3">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>#</strong>
                </TableCell>
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
                <TableCell>
                  <strong>จัดการ</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => {
                return (
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
                    <TableCell>{order.address}</TableCell>
                    <TableCell>{order.district}</TableCell>
                    <TableCell>{order.sub_area}</TableCell>
                    <TableCell>{order.sub_district}</TableCell>
                    <TableCell>{order.postcode}</TableCell>
                    <TableCell>{order.tel}</TableCell>
                    <TableCell>
                      {order.sended ? 'ส่งแล้ว' : 'ยังไม่ได้ส่ง'}
                    </TableCell>
                    <TableCell>
                      <Link
                        className="btn btn-sm btn-warning"
                        to={'/customer/edit/' + 1}
                      >
                        แก้ไข
                      </Link>
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
