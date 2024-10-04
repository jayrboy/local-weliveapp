import {
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material'

const OrderTable = (props) => {
  const { order, totalQuantity, totalPrice, totalExpressPrice } = props
  let sum = totalPrice + totalExpressPrice

  return (
    <TableContainer component={Paper} className="mt-3 mb-3">
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
              <strong>จำนวน</strong>
            </TableCell>
            <TableCell>
              <strong>ราคา (฿)</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {order.orders &&
            order.orders.length > 0 &&
            order.orders.map((o, index) => (
              <TableRow key={o.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Typography
                    noWrap
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '150px', // ปรับขนาดตามต้องการ
                    }}
                  >
                    {o.name}
                  </Typography>
                </TableCell>
                <TableCell>{o.quantity}</TableCell>
                <TableCell>
                  {o.price.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                </TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell colSpan={3} className="text-end">
              จำนวนสินค้ารวม
            </TableCell>
            <TableCell>{totalQuantity}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell colSpan={3} className="text-end">
              ราคาสินค้ารวม
            </TableCell>
            <TableCell>
              {totalPrice.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell colSpan={3} className="text-end">
              ค่าขนส่ง
            </TableCell>
            <TableCell>{totalExpressPrice}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell colSpan={3} className="text-end">
              ที่ต้องชำระ
            </TableCell>
            <TableCell>
              {sum.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export default OrderTable
