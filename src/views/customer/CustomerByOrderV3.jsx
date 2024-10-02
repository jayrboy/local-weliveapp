import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { editOrder } from '../../redux/saleOrderSlice'

import { baseURL } from '../../App'
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material'

import CreditScoreIcon from '@mui/icons-material/CreditScore'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ErrorIcon from '@mui/icons-material/Error'

import { FaRegArrowAltCircleDown } from 'react-icons/fa'
import { TbTruckDelivery } from 'react-icons/tb'
import { TfiReload } from 'react-icons/tfi'
import { RiErrorWarningFill } from 'react-icons/ri'

import {
  getOrder,
  calculateTotalQuantity,
  calculateTotalPrice,
  calculateTotalExpressPrice,
} from '../../redux/saleOrderSlice'
import LoadingFn from '../../components/LoadingFn'

export default function CustomerByOrderV3() {
  const dispatch = useDispatch()
  let { user } = useSelector((store) => store.user)
  let { order, isLoading, totalQuantity, totalPrice, totalExpressPrice } =
    useSelector((store) => store.saleOrder)
  // console.log(order.picture_payment)

  const { id } = useParams()

  let form = useRef()
  const [isDisabled, setIsDisabled] = useState(true) // สร้าง state สำหรับเก็บสถานะของปุ่ม

  const [imageBase64, setImageBase64] = useState('')

  // เรียก getOrder เพื่อดึงข้อมูลคำสั่งซื้อ
  useEffect(() => {
    if (id) {
      dispatch(getOrder(id))
    }
  }, [])

  // คำนวณ totalQuantity, totalPrice, และค่าขนส่ง เมื่อข้อมูล order อัปเดต
  useEffect(() => {
    if (order && order.orders && order.orders.length > 0) {
      dispatch(calculateTotalQuantity())
      dispatch(calculateTotalPrice())
      dispatch(calculateTotalExpressPrice())
      try {
        setImageBase64(order.picture_payment)
      } catch (error) {
        toast.warning('กรุณาแจ้งที่อยู่ / การชำระเงิน')
      }
    }
  }, [order])

  useEffect(() => {
    if (imageBase64) {
      setIsDisabled(false)
    }
  }, [imageBase64]) // เรียกใช้เมื่อ image เปลี่ยนแปลง

  if (isLoading) {
    return <LoadingFn />
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // ตรวจสอบขนาดไฟล์
      if (file.size > 100 * 1024) {
        // 100 KB
        toast.warning('ไฟล์ต้องมีขนาดไม่เกิน 100 KB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageBase64(reader.result) // เก็บ Base64 ไว้ใน state
      }
      reader.readAsDataURL(file) // อ่านไฟล์เป็น Data URL
    }
  }

  const cancelPayment = async () => {
    const formData = new FormData()
    formData.append('_id', order._id)
    formData.append('isPayment', false)
    formData.append('picture_payment', '') //เก็บรูปภาพเป็น "text"

    try {
      await axios.put(`${baseURL}/api/sale-order/j`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('ปฎิเสธการชำระข้อมูลสำเร็จ')
      dispatch(getOrder(id))
    } catch (error) {
      console.error(error)
      toast.error('Payment: There was an error!')
    }
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
      toast.error('Payment: There was an error!')
    }
  }

  const confirmSended = async () => {
    try {
      await axios.put(`${baseURL}/api/sale-order/sended/${id}`, {
        express: order.express, // Add this line to send the express value
      })
      toast.success('อัพเดตสถานะแล้ว')
      window.location.reload()
    } catch (error) {
      toast.error('Sended: There was an error!')
    }
  }

  const onEditData = (e) => {
    e.preventDefault(e)
    dispatch(editOrder())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsDisabled(true)

    const formData = new FormData(form.current)
    formData.append('_id', order._id)
    formData.append('isPayment', true)
    formData.append('picture_payment', imageBase64) // ส่งรูปภาพเป็น Base64

    // console.log(formData)

    try {
      await axios.put(`${baseURL}/api/sale-order/payment`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      toast.success('Success')
      dispatch(getOrder(id))
    } catch (error) {
      console.error(error)
      toast.error('Submit: There was an error!')
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
          {order.complete && (
            <>
              <p className="mt-3 text-success">
                <CreditScoreIcon /> ชำระเงินแล้ว
              </p>
              {order.sended && (
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

        <form onSubmit={handleSubmit} ref={form} encType="multipart/form-data">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                name="date_added"
                defaultValue={df}
                disabled={order.isPayment}
                required
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="ชื่อ-นามสกุล"
                fullWidth
                name="name"
                defaultValue={order.name}
                disabled={order.isPayment}
                required
              />
            </Grid>

            <Grid item xs={8}>
              <TextField
                label="ที่อยู่"
                fullWidth
                name="address"
                defaultValue={order.address}
                disabled={order.isPayment}
                required
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="ตำบล/แขวง"
                fullWidth
                name="district"
                defaultValue={order.district}
                disabled={order.isPayment}
                required
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="อำเภอ/เขต"
                fullWidth
                name="sub_area"
                defaultValue={order.sub_area}
                disabled={order.isPayment}
                required
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="จังหวัด"
                fullWidth
                name="sub_district"
                defaultValue={order.sub_district}
                disabled={order.isPayment}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="รหัสไปรษณีย์"
                fullWidth
                name="postcode"
                defaultValue={order.postcode}
                disabled={order.isPayment}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="เบอร์โทรศัพท์"
                fullWidth
                name="tel"
                defaultValue={order.tel}
                disabled={order.isPayment}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                อัปโหลดรูปภาพการชำระเงิน
              </Typography>
            </Grid>

            {imageBase64 && (
              <Grid
                item
                xs={12}
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                {/* เก็บรูปภาพเป็น "text" */}
                <img
                  src={imageBase64}
                  alt="Preview"
                  style={{
                    width: '50%', // ให้รูปภาพเต็มความกว้าง
                    height: 'auto', // ความสูงปรับตามสัดส่วน
                    objectFit: 'cover', // ปรับการแสดงผลของรูปภาพ
                  }}
                />
              </Grid>
            )}

            {!order.isPayment && (
              <Grid
                item
                xs={12}
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <input
                  accept="image/*"
                  id="upload-button-file"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <label htmlFor="upload-button-file">
                  <Button variant="contained" component="span" color="inherit">
                    {imageBase64 ? 'อัปโหลดรูปภาพใหม่' : 'อัปโหลดรูปภาพ'}
                  </Button>
                </label>
              </Grid>
            )}

            <Grid
              item
              xs={12}
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              {order.isPayment ? (
                <Button
                  variant="contained"
                  color="warning"
                  onClick={onEditData}
                >
                  แก้ไขข้อมูล
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isDisabled}
                >
                  บันทึก
                </Button>
              )}
            </Grid>

            {order.sended ? (
              <Grid
                item
                xs={12}
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  sx={{
                    display: 'flex', // ใช้ Flexbox เพื่อจัดเรียง
                    alignItems: 'center', // จัดให้อยู่ตรงกลางในแนวตั้ง
                    textAlign: 'center',
                  }}
                >
                  รอติดตามเลขพัสดุสินค้า &nbsp;
                  <TbTruckDelivery color="green" size={25} />
                </Typography>
              </Grid>
            ) : (
              <Grid
                item
                xs={12}
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                {order.complete ? (
                  <Typography
                    sx={{
                      display: 'flex', // ใช้ Flexbox เพื่อจัดเรียง
                      alignItems: 'center', // จัดให้อยู่ตรงกลางในแนวตั้ง
                      textAlign: 'center',
                    }}
                  >
                    รอยืนยันการส่งเลขพัสดุสินค้า&nbsp;
                    <ErrorIcon color="warning" />
                  </Typography>
                ) : (
                  <>
                    {order.isPayment != '' && (
                      <>
                        <Typography
                          sx={{
                            display: 'flex', // ใช้ Flexbox เพื่อจัดเรียง
                            alignItems: 'center', // จัดให้อยู่ตรงกลางในแนวตั้ง
                            textAlign: 'center',
                          }}
                        >
                          รอยืนยันการชำระเงิน&nbsp;
                          <ErrorIcon color="warning" />
                        </Typography>
                      </>
                    )}
                  </>
                )}
              </Grid>
            )}

            {user.role && !order.complete && (
              <>
                <Grid
                  item
                  xs={6}
                  container
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    onClick={cancelPayment}
                  >
                    ปฎิเสธการชำระเงิน
                  </Button>
                </Grid>

                <Grid
                  item
                  xs={6}
                  container
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button
                    type="button"
                    variant="contained"
                    color="success"
                    onClick={confirmPayment}
                  >
                    ยืนยันการชำระเงิน
                  </Button>
                </Grid>
              </>
            )}

            {order.complete && (
              <Grid item xs={12}>
                <TextField
                  label="เลขติดตามพัสดุสินค้า"
                  fullWidth
                  name="express"
                  defaultValue={order.express}
                  disabled={order.sended}
                  required
                />
              </Grid>
            )}

            {(user.role == 'admin' || user.role == 'user') && (
              <>
                {order.complete && (
                  <>
                    {order.sended ? (
                      <Grid
                        item
                        xs={12}
                        container
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Button
                          type="button"
                          variant="contained"
                          color="error"
                          onClick={confirmSended}
                        >
                          ยกเลิกการจัดส่ง
                        </Button>
                      </Grid>
                    ) : (
                      <Grid
                        item
                        xs={12}
                        container
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Button
                          type="button"
                          variant="contained"
                          color="warning"
                          onClick={confirmSended}
                        >
                          ยืนยันการส่งสินค้า
                        </Button>
                      </Grid>
                    )}
                  </>
                )}
              </>
            )}
          </Grid>
        </form>
      </Paper>
    </div>
  )
}
