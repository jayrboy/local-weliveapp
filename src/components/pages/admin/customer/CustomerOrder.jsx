import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import axios from 'axios'
import { baseURL } from '../../../../App'
import { Typography } from '@mui/material'

export default function CustomerOrder() {
  const [alldata, setalldata] = useState([])
  const [user, setUser] = useState(null)
  const [totalPrice, setTotalPrice] = useState(0)
  const token = localStorage.getItem('token')

  useEffect(() => {
    calculateTotalPrice()
  }, [alldata])

  const calculateTotalPrice = () => {
    let total = 0
    alldata.forEach((item) => {
      if (item.name === 'Jakkrit Onsomkrit') {
        item.orders.forEach((order) => {
          total += order.price * order.quantity
        })
      }
    })
    setTotalPrice(total)
  }

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }

        const response = await axios.post(
          `${baseURL}/api/current-user`,
          {},
          config
        )
        setUser(response.data)
      } catch (error) {
        console.error('Error fetching current user:', error.response?.data)
      }
    }

    getCurrentUser()
  }, [token])

  useEffect(() => {
    const fetchSaleOrder = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/sale-order`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setalldata(response.data)
      } catch (error) {
        console.error('There was an error!', error)
      }
    }

    if (token && user) {
      fetchSaleOrder()
    }
  }, [token, user])

  useEffect(() => {
    const user = alldata.find((item) => item.name === 'Jakkrit Onsomkrit')
    if (user) {
      setFormData((prevState) => ({
        ...prevState,
        OrderID: user.idFb,
        user: user.name,
      }))
    }
  }, [alldata])

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
    OrderID: '',
    user: '',
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: files[0],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const form = new FormData()
      form.append('idFb', formData.OrderID)
      form.append('name', formData.user)
      form.append('transactionDate', formData.transactionDate)
      form.append('transactionTime', formData.transactionTime)
      form.append('transactionAmount', formData.transactionAmount)
      form.append('transactionImage', formData.transactionImage)
      form.append('customerName', formData.customerName)
      form.append('customerAddress', formData.customerAddress)
      form.append('customerProvince', formData.customerProvince)
      form.append('customerPostalCode', formData.customerPostalCode)
      form.append('customerPhone', formData.customerPhone)

      const response = await axios.post(`${baseURL}/api/sale-order`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('Response Data:', response.data)
    } catch (error) {
      console.error('There was an error!', error)
    }
  }

  return (
    <div className="position-relative mt-5">
      <div className="card">
        <div className="m-3">
          <h5>
            WeLive | <span className="text-success">สินค้าของคุณ</span>
          </h5>
          <div className="container mt-3 mx-auto">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="text-center">วันที่</TableCell>
                    <TableCell className="text-center">ชื่อ</TableCell>
                    <TableCell className="text-center">ความคิดเห็น</TableCell>
                    <TableCell className="text-center">จำนวนชิ้น</TableCell>
                    <TableCell className="text-center">ราคารวม</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alldata && alldata.length > 0 ? (
                    alldata.map(
                      (alldata, alldataIndex) =>
                        alldata.name === 'Jakkrit Onsomkrit' &&
                        alldata.orders.map((order, orderIndex) => (
                          <TableRow key={`${alldataIndex}-${orderIndex}`}>
                            <TableCell className="text-center">
                              {alldata.date_added}
                            </TableCell>
                            <TableCell className="text-center">
                              {alldata.name}
                            </TableCell>
                            <TableCell className="text-center">
                              {order.name}
                            </TableCell>
                            <TableCell className="text-center">
                              {order.quantity}
                            </TableCell>
                            <TableCell className="text-center">
                              {order.price * order.quantity} บาท
                            </TableCell>
                          </TableRow>
                        ))
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        ไม่มีข้อมูล
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      รวมทั้งหมด {totalPrice} บาท
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
        <div className="mt-3">
          <div className="m-3 ms-5">
            <div className="card">
              <div className="m-3">
                <span>Order</span>
                <span className="text-danger ms-3 ">#{formData.OrderID}</span>
                <span className="ms-3">
                  Facebook Name :{' '}
                  <span className="text-primary ">{formData.user}</span>
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
                    <div className="col-md-6">
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
                          onChange={handleFileChange}
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
  )
}
