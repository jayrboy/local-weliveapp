import React, { useState } from 'react'
import Paper from '@mui/material/Paper'
import { productList } from '../../../../data.js'
import { orderDetail } from '../../../../data.js'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

export default function CustmoerOrder() {
  const formatDateTime = () => {
    const now = new Date()
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }
    return now.toLocaleString('th-TH', options)
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
    // ตรวจสอบว่าข้อมูลที่จำเป็นถูกกรอกครบหรือไม่
    if (
      formData.transactionDate &&
      formData.transactionAmount &&
      formData.customerName
    ) {
      // แสดงข้อมูลใน console
      console.log('Form submitted:', formData)
      // ส่งข้อมูลไปยัง API หรือทำการประมวลผลต่อไปตามความเหมาะสม
      // ตัวอย่าง: fetch('https://example.com/api/submit', { method: 'POST', body: JSON.stringify(formData) })
      // และจัดการการตอบกลับจากเซิร์ฟเวอร์
    } else {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน')
    }
  }

  return (
    <div className="position-relative mt-5">
      <div className="mt-3">
        <div className="card">
          <div className="m-3 ms-5">
            <form onSubmit={handleSubmit}>
              <div className="card">
                <div className="m-3">
                  <span hidden name="UserID">
                    UserID : {orderDetail[0].from.userid}
                  </span>
                  <span>Order</span>
                  <span className="text-danger ms-3 " name="OrderID">
                    #{formData.OrderID}
                  </span>
                  <span className="ms-3">Facebook Name : </span>
                  <span className="ms-3 text-primary">
                    {orderDetail[0].from.fbName}
                  </span>
                  <br />
                  <span>วันที่และเวลาปัจจุบัน :</span>
                  <span className="ms-3 text-primary">{formatDateTime()}</span>
                </div>
              </div>
              <div className="container float-start">
                <div className="container mt-3 mx-auto shadow">
                  <form className="m-3">
                    <div className="row">
                      <div className="col-md-6 ">
                        <div className="mb-3">
                          <label>วันที่ทำรายการ</label>
                          <input
                            type="date"
                            className="form-control"
                            name="transactionDate"
                            value={formData.transactionDate}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label>เวลาที่ทำรายการ</label>
                          <input
                            type="time"
                            className="form-control"
                            name="transactionTime"
                            value={formData.transactionTime}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label>จำนวนเงินที่ทำรายการ</label>
                          <input
                            type="number"
                            className="form-control"
                            name="transactionAmount"
                            value={formData.transactionAmount}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label>อัพโหลดภาพสลิปการโอนเงิน</label>
                          <input
                            type="file"
                            className="form-control"
                            name="transactionImage"
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label>ชื่อ</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="ใส่ชื่อผู้โอน"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label>ที่อยู่</label>
                          <textarea
                            rows="3"
                            type="text"
                            className="form-control"
                            placeholder="กรอกที่อยู่ของลูกค้า ระบุให้ชัดเจน"
                            name="customerAddress"
                            value={formData.customerAddress}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label>ตำบล/แขวง</label>
                          <input
                            type="text"
                            className="form-control"
                            name="customerSubdistrict"
                            value={formData.customerSubdistrict}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label>อำเภอ/เขต</label>
                          <input
                            type="text"
                            className="form-control"
                            name="customerDistrict"
                            value={formData.customerDistrict}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label>จังหวัด</label>
                          <input
                            type="text"
                            className="form-control"
                            name="customerProvince"
                            value={formData.customerProvince}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label>รหัสไปรษณีย์</label>
                          <input
                            type="text"
                            className="form-control"
                            name="customerPostalCode"
                            value={formData.customerPostalCode}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label>โทรศัพท์</label>
                          <input
                            type="text"
                            className="form-control"
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleInputChange}
                          />
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
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
