import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { json, useParams } from 'react-router-dom'
import { baseURL } from '../../App'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Editor from '../customer/Editor'
import Quill from 'quill'
import CreditScoreIcon from '@mui/icons-material/CreditScore'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import {
  getOrder,
  calculateTotalQuantity,
  calculateTotalPrice,
  calculateTotalExpressPrice,
} from '../../redux/saleOrderSlice'
import LoadingFn from '../../components/LoadingFn'

export default function CustomerByOrderV2() {
  const Delta = Quill.import('delta')
  const [range, setRange] = useState()

  const dispatch = useDispatch()
  let { user } = useSelector((store) => store.user)
  let { order, isLoading, totalQuantity, totalPrice, totalExpressPrice } =
    useSelector((store) => store.saleOrder)
  console.log(order)

  const [lastChange, setLastChange] = useState()
  const [readOnly, setReadOnly] = useState(false)
  const quillRef = useRef()
  const { id } = useParams()
  const [image, setImage] = useState(new Delta().insert('')) // ค่าเริ่มต้นเป็น Delta ว่าง
  const [formData, setFormData] = useState([])

  // เรียก getOrder เพื่อดึงข้อมูลคำสั่งซื้อ
  useEffect(() => {
    if (id) {
      dispatch(getOrder(id))
    }
  }, [dispatch, id])

  // คำนวณ totalQuantity, totalPrice, และค่าขนส่ง เมื่อข้อมูล order อัปเดต
  useEffect(() => {
    if (order && order.orders && order.orders.length > 0) {
      dispatch(calculateTotalQuantity())
      dispatch(calculateTotalPrice())
      dispatch(calculateTotalExpressPrice())
      try {
        setImage(JSON.parse(order.picture_payment))
        setFormData(order)
      } catch (error) {
        toast.warning('ยังไม่แนปรูปภาพการชำระเงิน')
      }
    }
  }, [dispatch, order])

  if (isLoading) {
    return <LoadingFn />
  }

  const confirmPayment = async () => {
    try {
      await axios.put(`${baseURL}/api/sale-order/complete/${id}`, {
        orders: order.orders.map((o) => ({
          order_id: o._id,
          quantity: o.quantity,
        })),
      })

      toast.success('อัพเดตสถานะแล้ว')
      window.location.reload()
    } catch (error) {
      console.log('Payment: There was an error!', error)
    }
  }

  const confirmSended = async () => {
    try {
      await axios.put(`${baseURL}/api/sale-order/sended/${id}`, {
        express: formData.express, // Add this line to send the express value
      })
      toast.success('อัพเดตสถานะแล้ว')
      window.location.reload()
    } catch (error) {
      console.log('Sended: There was an error!', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    console.log(name, value)
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formDataToSend = new FormData()

    formDataToSend.append(
      'picture_payment',
      JSON.stringify(quillRef.current?.getContents())
    )
    formDataToSend.append('name', formData.name)
    formDataToSend.append('address', formData.address)
    formDataToSend.append('sub_district', formData.sub_district)
    formDataToSend.append('sub_area', formData.sub_area)
    formDataToSend.append('district', formData.district)
    formDataToSend.append('postcode', formData.postcode)
    formDataToSend.append('tel', formData.tel)
    formDataToSend.append('express', formData.express)
    formDataToSend.append('date_added', formData.date_added)
    formDataToSend.append('_id', id)

    const formEnt = Object.fromEntries(formDataToSend.entries())
    // console.log(formEnt)

    try {
      const response = await axios.put(
        `${baseURL}/api/sale-order`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    } catch (error) {
      console.log('Submit: There was an error!', error)
    }
  }

  let dt = new Date(Date.parse(order.date_added))
  let df = dt.toISOString().substring(0, 10) // แปลงเป็นรูปแบบ YYYY-MM-DD
  let sum = totalPrice + totalExpressPrice

  return (
    <div className="container position-relative mt-3 mx-auto">
      <h3 className="text-start mb-3">
        <span className="text-success ms-2 text-center">
          รายการสั่งซื้อของคุณ {order.name}
          {order.complete == true && (
            <>
              <p className="mt-3 text-success">
                <CreditScoreIcon /> ชำระเงินแล้ว
              </p>
              {order.sended == true && (
                <>
                  <p className="mt-3 text-warning">
                    <LocalShippingIcon /> จัดส่งแล้ว
                  </p>
                </>
              )}
            </>
          )}
        </span>
      </h3>

      <div className="card shadow">
        <div className="text-center">
          <br />
          <span> Order :</span>
          <span className="text-danger">#{id}</span> <br />
          --------------------------------------------
          <br />
          <br />
          พร้อมเพย์ 012-345-6789
          <br />
          ธนาคารกสิกร (KBANK) 012-345-6789
          <br />
          ชื่อบัญชี นายเจษฎากร คุ้มเดช
          <br />
          <br />
          --------------------------------------------
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
                  <TableCell>{o.name}</TableCell>
                  <TableCell>{o.quantity}</TableCell>
                  <TableCell>
                    {o.price
                      .toFixed(0)
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
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
                {totalPrice
                  .toFixed(0)
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
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

      <Paper elevation={3} className="mt-4 p-4">
        <Typography variant="h6" gutterBottom>
          แบบฟอร์มสำหรับกรอกข้อมูล
        </Typography>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                name="date_added"
                defaultValue={df}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="ชื่อ-นามสกุล"
                fullWidth
                name="name"
                defaultValue={order.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={8}>
              <TextField
                label="ที่อยู่"
                fullWidth
                name="address"
                defaultValue={order.address}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="ตำบล"
                fullWidth
                name="district"
                defaultValue={order.district}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="อำเภอ"
                fullWidth
                name="sub_area"
                defaultValue={order.sub_area}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="จังหวัด"
                fullWidth
                name="sub_district"
                defaultValue={order.sub_district}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="รหัสไปรษณีย์"
                fullWidth
                name="postcode"
                defaultValue={order.postcode}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="เบอร์โทรศัพท์"
                fullWidth
                name="tel"
                defaultValue={order.tel}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                อัปโหลดรูปภาพ
              </Typography>
              <Editor
                ref={quillRef}
                readOnly={readOnly}
                onSelectionChange={setRange}
                onTextChange={setLastChange}
                defaultValue={image} // ใช้ defaultValue
              />
            </Grid>

            {/* Event Action */}
            <Grid item xs={6}>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={confirmPayment}
              >
                ส่งแบบฟอร์มการชำระเงิน
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button
                type="button"
                variant="contained"
                color="error"
                onClick={confirmPayment}
              >
                ปฎิเสธการชำระเงิน
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="เลขติดตามพัสดุสินค้า"
                fullWidth
                name="express"
                defaultValue={order.express}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <Button
                type="button"
                variant="contained"
                color="warning"
                onClick={confirmSended}
              >
                ยืนยันการส่งสินค้า
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button
                type="button"
                variant="contained"
                color="error"
                onClick={confirmSended}
              >
                ยกเลิกสถานะการจัดส่ง
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  )
}
