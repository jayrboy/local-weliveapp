import { baseURL } from '../../App'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { MdGrid3X3 } from 'react-icons/md'
import { MdOutlineSearch } from 'react-icons/md'
import PrintIcon from '@mui/icons-material/Print'

import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { IconButton } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import { useEffect } from 'react'

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

  const filteredOrders = orders.filter(
    (order) => order.complete && !order.isDelete
  )

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
        <form>
          <div className="d-flex mb-1 justify-content-end">
            <input
              className="form-control form-control-sm ms-1"
              name="expressDate"
              type="date"
              style={{ width: '150px' }}
            />
            <input
              className="form-control form-control-sm ms-1"
              type="expressID"
              placeholder="เลขพัสดุ"
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
              <small>
                {' '}
                พบข้อมูลทั้งหมด{' '}
                {
                  orders.filter((order) => order.complete && !orders.isDelete)
                    .length
                }{' '}
                รายการ
              </small>
            </caption>
            <TableHead>
              <TableRow>
                <TableCell>
                  <MdGrid3X3 />
                </TableCell>
                <TableCell>
                  <strong>สั่งซื้อ</strong>
                </TableCell>
                <TableCell>
                  <strong>ชื่อ Facebook</strong>
                </TableCell>
                <TableCell>
                  <strong>เลขพัสดุ</strong>
                </TableCell>
                <TableCell>
                  <strong>เวลาเช็คเอ้าท์</strong>
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
              {filteredOrders.map((order, i) => {
                // คำนวณค่า itempr * among - discount

                let dt = new Date(Date.parse(order.createdAt))
                let df = (
                  <>
                    {dt.getDate()}-{dt.getMonth() + 1}-{dt.getFullYear()}
                  </>
                )

                let udt = new Date(Date.parse(order.updatedAt))
                let udf = (
                  <>
                    {udt.getDate()}-{udt.getMonth() + 1}-{udt.getFullYear()}
                  </>
                )
                console.log(orders)

                return (
                  <StyledTableRow key={order._id}>
                    <TableCell>{i + 1}</TableCell>
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
