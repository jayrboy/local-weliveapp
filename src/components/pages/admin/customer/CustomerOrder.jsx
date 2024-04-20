import React, { useState } from 'react'
import Paper from '@mui/material/Paper'
import { productList } from '../../../../data.js'
import { orderDetail } from '../../../../data.js'
import { comments } from '../../../../data.js'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

export default function CustomerOrder() {
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

  const usernamesToDisplay = ['Jay Jakkrit']

  const provinces = [
    'กรุงเทพมหานคร',
    'กระบี่',
    'กาญจนบุรี',
    'กาฬสินธุ์',
    'กำแพงเพชร',
    'ขอนแก่น',
    'จันทบุรี',
    'ฉะเชิงเทรา',
    'ชลบุรี',
    'ชัยนาท',
    'ชัยภูมิ',
    'ชุมพร',
    'เชียงราย',
    'เชียงใหม่',
    'ตรัง',
    'ตราด',
    'ตาก',
    'นครนายก',
    'นครปฐม',
    'นครพนม',
    'นครราชสีมา',
    'นครศรีธรรมราช',
    'นครสวรรค์',
    'นนทบุรี',
    'นราธิวาส',
    'น่าน',
    'บึงกาฬ',
    'บุรีรัมย์',
    'ปทุมธานี',
    'ประจวบคีรีขันธ์',
    'ปราจีนบุรี',
    'ปัตตานี',
    'พระนครศรีอยุธยา',
    'พะเยา',
    'พังงา',
    'พัทลุง',
    'พิจิตร',
    'พิษณุโลก',
    'เพชรบุรี',
    'เพชรบูรณ์',
    'แพร่',
    'ภูเก็ต',
    'มหาสารคาม',
    'มุกดาหาร',
    'แม่ฮ่องสอน',
    'ยโสธร',
    'ยะลา',
    'ร้อยเอ็ด',
    'ระนอง',
    'ระยอง',
    'ราชบุรี',
    'ลพบุรี',
    'ลำปาง',
    'ลำพูน',
    'เลย',
    'ศรีสะเกษ',
    'สกลนคร',
    'สงขลา',
    'สตูล',
    'สมุทรปราการ',
    'สมุทรสงคราม',
    'สมุทรสาคร',
    'สระแก้ว',
    'สระบุรี',
    'สิงห์บุรี',
    'สุโขทัย',
    'สุพรรณบุรี',
    'สุราษฎร์ธานี',
    'สุรินทร์',
    'หนองคาย',
    'หนองบัวลำภู',
    'อ่างทอง',
    'อำนาจเจริญ',
    'อุดรธานี',
    'อุตรดิตถ์',
    'อุทัยธานี',
    'อุบลราชธานี',
  ]

  const [formData, setFormData] = useState({
    OrderID: comments[0].from.id,
    UserID: comments[0].from.name,
    transactionDate: '',
    transactionTime: '',
    transactionAmount: '',
    transactionImage: '',
    customerName: '',
    customerAddress: '',
    customerProvince: '',
    customerPostalCode: '',
    customerPhone: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const extractDataFromMessage = (message) => {
    // ตัดข้อความที่อยู่หลังเครื่องหมาย "="
    const data = message.split('=')[1].trim()

    // แยกรหัสสินค้าและจำนวน
    const [productCode, quantity] = data.split(' ')

    return {
      productCode,
      quantity,
    }
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
      // fetch('https://example.com/api/submit', { method: 'POST', body: JSON.stringify(formData) })
      // และจัดการการตอบกลับจากเซิร์ฟเวอร์
    } else {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน')
    }
  }

  return (
    <div className="position-relative mt-5">
      <div className=" card">
        <div className="">
          <div className=" m-3">
            <h5>
              WeLive | <span className=" text-success">สินค้าของคุณ</span>
            </h5>
            <div className="container mt-3 mx-auto">
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className=" text-center">วันที่</TableCell>
                      <TableCell className=" text-center">ชื่อ</TableCell>
                      <TableCell className=" text-center">
                        ความคิดเห็น
                      </TableCell>
                      <TableCell className=" text-center">
                        รหัสที่สั่งซื้อ
                      </TableCell>
                      <TableCell>จำนวนชิ้น</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Map through comments and display them */}
                    {comments.map(
                      (comment, index) =>
                        usernamesToDisplay.includes(comment.from.name) && (
                          <TableRow key={index} className=" text-center">
                            <TableCell className=" text-center">
                              {comment.created_time}
                            </TableCell>
                            <TableCell className=" text-center">
                              {comment.from.name}
                            </TableCell>
                            <TableCell className=" text-center">
                              {comment.message}
                            </TableCell>
                            {comment.message.includes('=') ? (
                              // แยกข้อมูลและแสดงผลรหัสสินค้า
                              <TableCell className=" text-center">
                                {
                                  extractDataFromMessage(comment.message)
                                    .productCode
                                }
                              </TableCell>
                            ) : (
                              <TableCell className=" text-center">-</TableCell>
                            )}
                            {comment.message.includes('=') ? (
                              // แยกข้อมูลและแสดงผลจำนวน
                              <TableCell className=" text-center">
                                {
                                  extractDataFromMessage(comment.message)
                                    .quantity
                                }
                              </TableCell>
                            ) : (
                              <TableCell className=" text-center">-</TableCell>
                            )}
                          </TableRow>
                        )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="">
            <div className="m-3 ms-5">
              <div className="card">
                <div className="m-3">
                  <span>Order</span>
                  <span className="text-danger ms-3 ">#{formData.OrderID}</span>
                  <span className="ms-3">
                    Facebook Name :{' '}
                    <span className=" text-primary ">
                      {comments[0].from.name}
                    </span>
                  </span>
                  <br />
                  <span>วันที่และเวลาปัจจุบัน :</span>
                  <span className="ms-3 text-primary">{formatDateTime()}</span>
                </div>
              </div>
              <div className="container float-start">
                <div className="container mt-3 mx-auto shadow">
                  <form className="m-3" onSubmit={handleSubmit}>
                    <div className="row">
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
                            <label>จังหวัด</label>
                            <select
                              className="form-select"
                              name="customerProvince"
                              value={formData.customerProvince}
                              onChange={handleInputChange}
                            >
                              <option value="">เลือกจังหวัด</option>
                              {provinces.map((province, index) => (
                                <option key={index} value={province}>
                                  {province}
                                </option>
                              ))}
                            </select>
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
          </div>
        </div>
      </div>
    </div>
  )
}
