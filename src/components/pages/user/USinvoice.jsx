import React, { useState } from 'react'
import Paper from '@mui/material/Paper'
import { productList } from '../../../data'
import { orderDetail } from '../../../data'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
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
                    />
                  </label>
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
                    />
                  </label>
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
