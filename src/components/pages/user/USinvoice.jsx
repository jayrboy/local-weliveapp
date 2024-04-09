import React, { useState } from 'react'
import Paper from '@mui/material/Paper'
import { productList } from '../../../data'
import { orderDetail } from '../../../data'

import { productList } from '../../../data'

import { styled } from '@mui/material/styles'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

export default function USinvoice() {
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
  const [formData, setFormData] = useState({
    OrderID: orderDetail[0].from.orderID,
    UserID: orderDetail[0].from.userid,
    transactionDate: '',
    transactionAmount: '',
    transactionImage: '',
    customerName: '',
    customerAddress: '',
    customerSubdistrict: '',
    customerDistrict: '',
    customerProvince: '',
    customerPostalCode: '',
    customerPhone: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (
      formData.transactionDate &&
      formData.transactionAmount &&
      formData.customerName
    ) {
      console.log('Form submitted:', formData)
      // ส่งข้อมูลไปยัง API หรือทำการประมวลผลต่อไปตามความเหมาะสม
      // ตัวอย่าง: fetch('https://example.com/api/submit', { method: 'POST', body: JSON.stringify(formData) })
      // และจัดการการตอบกลับจากเซิร์ฟเวอร์
    } else {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน')
    }
  }

  return (
    <div className="position-relative mt-5 ">
      <div className="mt-3">
        <div className="card">
          <div className="m-3">{/* ส่วนอื่น ๆ ของโค้ด */}</div>
          <div className="m-3 ms-5">
            <form onSubmit={handleSubmit}>
              <div className="card">
                <div className=" m-3">
                  {orderDetail.map((order, index) => (
                    <div key={index}>
                      <span hidden>UserID : {order.from.userid}</span>
                      <span>Order</span>
                      <span className=" text-danger ms-3 ">
                        #{order.from.orderID}
                      </span>
                      <span className="ms-3">Facebook Name : </span>
                      <span className="ms-3 text-primary">
                        {order.from.fbName}
                      </span>
                      <br />
                      <span>วันที่และเวลาปัจจุบัน :</span>
                      <span className="ms-3 text-primary">
                        {formatDateTime()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="container float-start">
                <div className="row mt-3">
                  <label>
                    {' '}
                    วันที่ทำรายการ
                    <br />
                    <input
                      type="date"
                      className="w-25"
                      name="transactionDate"
                      value={formData.transactionDate}
                      onChange={handleInputChange}
                    />
                    <input type="time" className="w-25 ms-3" />
                  </label>
                </div>
                <div className="row mt-3">
                  <label>
                    จำนวนเงินที่ทำรายการ
                    <br />
                    <input
                      type="number"
                      className="text-body"
                      name="transactionAmount"
                      value={formData.transactionAmount}
                      onChange={handleInputChange}
                    />
                  </label>

                  <label className="mt-3">
                    อัพโหลดภาพสลิปการโอนเงิน
                    <br />
                    <input
                      type="file"
                      className="img-thumbnail bg-success-subtle"
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className="row mt-3">
                  <label>
                    ชื่อ
                    <br />
                    <input
                      type="text"
                      placeholder="ใส่ชื่อผู้โอน"
                      className="w-100"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}

import Paper from '@mui/material/Paper'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export default function USinvoice() {
  return (
    <div className="container position-relative mt-3 mx-auto">
      <h3 className="mb-5 m-3">
        <span>We Live App</span>
        <span className=" text-success ms-2">| รายการสั่งซื้อ</span>
      </h3>
      <div className="card shadow">
        <div className="text-center">
          <br />
          <span> Order :</span>
          <span className=" text-danger">#{'12160'}</span> <br />
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
      <div className="mt-4">
        <div className="card shadow">
          <div className="m-4">
            <span>Order</span>
            <span className=" text-danger ms-3">#{'12160'}</span>
            <span className="ms-3">Facebook Name : {'..............'}</span>
            <br />
            <span>วันที่ทำรายการ :</span>
            <span className="ms-3">{'..............'}</span>
          </div>

          <TableContainer component={Paper}>
            <Table aria-label="customized table">
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
                    <StyledTableRow
                      key={product.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
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
                    </StyledTableRow>
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

          <div className="container mt-3 mx-auto shadow">
            <form className="m-3">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label>วันที่ทำรายการ</label>
                    <input type="date" className="form-control" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label></label>
                    <input type="time" className="form-control" />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label>จำนวนเงินที่ทำรายการ</label>
                    <input type="number" className="form-control" />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label>อัพโหลดภาพสลิปการโอนเงิน</label>
                    <input type="file" className="form-control" />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label>ชื่อ</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ใส่ชื่อผู้โอน"

                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <label>
                    ที่อยู่
                    <br />
                    <textarea
                      type="text"
                      placeholder="กรอกที่อยู่ของลูกค้า ระบุให้ชัดเจน"
                      className="w-100"
                      name="customerAddress"
                      value={formData.customerAddress}
                      onChange={handleInputChange}

                <div className="col-md-12">
                  <div className="mb-3">
                    <label>ที่อยู่</label>
                    <textarea
                      rows="3"
                      type="text"
                      className="form-control"
                      placeholder="กรอกที่อยู่ของลูกค้า ระบุให้ชัดเจน"

                    />
                  </div>
                </div>

                <div className="row mt-3 w-100">
                  <div className="col">
                    <label>
                      ตำบล/แขวง
                      <br />
                      <input
                        className="w-auto"
                        type="text"
                        name="customerSubdistrict"
                        value={formData.customerSubdistrict}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  <div className="col">
                    <label>
                      อำเภอ/เขต
                      <br />
                      <input
                        className="w-auto"
                        type="text"
                        name="customerDistrict"
                        value={formData.customerDistrict}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                </div>
                <div className="row mt-3 w-100">
                  <div className="col">
                    <label>
                      จังหวัด
                      <br />
                      <input
                        className="w-auto"
                        type="text"
                        name="customerProvince"
                        value={formData.customerProvince}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  <div className="col">
                    <label>
                      รหัสไปรษณีย์
                      <br />
                      <input
                        className="w-auto"
                        type="text"
                        name="customerPostalCode"
                        value={formData.customerPostalCode}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  <div className="row mt-3">
                    <label>
                      โทรศัพท์
                      <br />
                      <input
                        type="text"
                        className="w-100"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                </div>
                <button className="btn btn-primary mt-3 mb-3" type="submit">

                <div className="col-md-6">
                  <div className="mb-3">
                    <label>ตำบล/แขวง</label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label>อำเภอ/เขต</label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label>จังหวัด</label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label>รหัสไปรษณีย์</label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label>โทรศัพท์</label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <input type="checkbox" name="save" /> &nbsp;
                    <label>
                      ยอมรับ <a href="">นโยบายความเป็นส่วนตัว</a>
                    </label>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button
                  className="btn btn-sm btn-primary mt-3 mb-3 "
                  type="submit"
                >

                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>
  )
}
