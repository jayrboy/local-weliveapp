import Paper from '@mui/material/Paper'
import { productList } from '../../../data'
import { orderDetail } from '../../../data'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

export default function USorder() {
  const formatDateTime = () => {
    const now = new Date() // สร้างวัตถุ Date เพื่อรับค่าวันที่และเวลาปัจจุบัน
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    } // กำหนดรูปแบบการแสดงผลวันที่และเวลา
    return now.toLocaleString('th-TH', options) // แปลงวันที่และเวลาให้เป็นข้อความในรูปแบบที่กำหนด
  }
  return (
    <div>
      <div className=" card">
        <div className=" m-3">
          {orderDetail.map((order, index) => (
            <div key={index}>
              <span>Order</span>
              <span className=" text-danger ms-3">{order.from.orderID}</span>
              <span className="ms-3">Facebook Name : </span>
              <span className="ms-3 text-primary">{order.from.fbName}</span>
              <br />
              <span>วันที่ทำรายการ :</span>
              <span className="ms-3 text-primary">{formatDateTime()}</span>
            </div>
          ))}
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="text-success text-center">#</TableCell>
                <TableCell className="text-success text-center">
                  CF CODE
                </TableCell>
                <TableCell className="text-success text-center">NAME</TableCell>
                <TableCell className="text-success text-center">
                  AMOUNT
                </TableCell>
                <TableCell className="text-success text-center">
                  PRICE
                </TableCell>
                <TableCell className="text-success text-center">
                  SUMMARY
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productList.map((product, i) => {
                return (
                  <TableRow
                    key={product.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell className="text-center">{i + 1}</TableCell>
                    <TableCell className="text-center">
                      {product.from.CFcode}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.from.proName}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.from.proAmount}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.from.proPrice}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.from.proSum}
                    </TableCell>
                  </TableRow>
                )
              })}
              {/* Additional row for discount, shipping cost, and total */}
              <TableRow>
                <TableCell colSpan={1} />
                <TableCell className="text-center">ส่วนลด</TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center">0</TableCell>
              </TableRow>
              {/* Additional row for displaying discount, shipping cost, and total */}
              <TableRow>
                <TableCell colSpan={1} />
                <TableCell className="text-center">ส่วนลด</TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center">49</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={1} />
                <TableCell className="text-center">รวม (....) ชิ้น</TableCell>
                <TableCell className="text-center">ราคา ...... บาท</TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center">49</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}
