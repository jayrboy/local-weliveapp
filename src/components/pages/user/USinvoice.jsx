import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import { productList } from '../../../data'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import {
  TableColumnReordering,
  TableFixedColumns,
} from '@devexpress/dx-react-grid'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

export default function USinvoice() {
  return (
    <div className=" position-relative mt-5 ">
      <h3 className=" m-3">
        <span>We Live</span>
        <span className=" text-success ms-2">| รายการสินค้า</span>
      </h3>
      <div className="card">
        <div className=" text-center">
          <br />
          <span> Order :</span>
          <span className=" text-danger">#12160</span> <br />
          <span> เลขที่บัญชี....</span>
          <br />
          เลขที่บัญชี
          <br />
          <br />
          --------------------------------------------
          <br />
          <br />
          พร้อมเพย์ xxxxxxxxxx
          <br />
          KBANK xxx-x-xxxxx-x
          <br />
          ชื่อบัญชี นายเจษฎากร คุ้มเดช
          <br />
          <br />
          🙏 รบกวนขอความกรุณาลูกค้า 💢 โอนยอดบิลต่อบิลนะคะ
          แล้วค่อยเอฟใหม่ได้คะ💢
          <br /> 💢หากมียอดค้างหักลบยอดเอง โอนได้เลยคะ
          รบกวนแนบรูปยอดค้างไว้ได้เลยคะ ขอบคุณมากค่ะ🙏
          <br /> 🙏 ถ้าสินค้ามีตำหนิกรุณารีบแจ้ง รับเปลี่ยน
          หรือคืนสินค้ามีตำหนิจากร้าน ส่งผิดสีผิดแบบ ผิดไซส์ เท่านั้นคะ
          ขอบพระคุณมากคะ🙏
          <br />
          <br />
        </div>
      </div>
      <div className=" mt-3">
        <div className=" card">
          <div className=" m-3">
            <span>Order</span>
            <span className=" text-danger ms-3">#12160</span>
            <span className="ms-3">Facebook Name : ..............</span>
            <br />
            <span>วันที่ทำรายการ :</span>
            <span className="ms-3">.................</span>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="text-success text-center">#</TableCell>
                  <TableCell className="text-success text-center">
                    CF CODE
                  </TableCell>
                  <TableCell className="text-success text-center">
                    NAME
                  </TableCell>
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

          <div className=" m-3 ms-5 border-3 border-top border-bottom border-success">
            <form>
              <div className=" container float-start ">
                <div className="row mt-3">
                  <label>
                    {' '}
                    วันที่ทำรายการ
                    <br />
                    <input type="date" className="w-25" />
                    <input type="time" className="w-25 ms-3" />
                  </label>
                </div>
                <div className="row mt-3">
                  <label>
                    จำนวนเงินที่ทำรายการ
                    <br />
                    <input type=" number" className=" text-body" />
                  </label>

                  <label className=" mt-3">
                    อัพโหลดภาพสลิปการโอนเงิน
                    <br />
                    <input
                      type="file"
                      className=" img-thumbnail bg-success-subtle"
                    ></input>
                  </label>
                </div>
                <div className=" row mt-3">
                  <label>
                    ชื่อ
                    <br />
                    <input
                      type=" text "
                      placeholder="ใส่ชื่อผู้โอน"
                      className=" w-100"
                    />
                  </label>
                </div>
                <div className=" row mt-3">
                  <label>
                    ที่อยู่
                    <br />
                    <textarea
                      type=" text "
                      placeholder="กรอกที่อยู่ของลูกค้า ระบุให้ชัดเจน"
                      className="w-100"
                    />
                  </label>
                </div>

                <div className=" row mt-3 w-100">
                  <div className="col">
                    <label>
                      ตำบล/แขวง
                      <br />
                      <input className="w-auto" type=" text " />
                    </label>
                  </div>
                  <div className="col">
                    <label>
                      อำเภอ/เขต
                      <br />
                      <input className="w-auto" type=" text " />
                    </label>
                  </div>
                </div>
                <div className=" row mt-3 w-100">
                  <div className="col">
                    <label>
                      จังหวัด
                      <br />
                      <input className="w-auto" type=" text " />
                    </label>
                  </div>
                  <div className="col">
                    <label>
                      รหัสไปรษณีย์
                      <br />
                      <input className="w-auto" type=" text " />
                    </label>
                  </div>

                  <div className=" row mt-3">
                    <label>
                      โทรศัพท์
                      <br />
                      <input type=" text " className=" w-100" />
                    </label>
                  </div>
                </div>
                <button className="btn btn-primary mt-3 mb-3 " type="submit">
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
