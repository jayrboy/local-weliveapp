import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'

import { baseURL } from '../../App'

import axios from 'axios'
import {
  getOrder,
  editOrder,
  calculateTotalQuantity,
  calculateTotalPrice,
  calculateTotalExpressPrice,
} from '../../redux/saleOrderSlice'

import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  InputAdornment,
} from '@mui/material'

import ErrorIcon from '@mui/icons-material/Error'
import CachedIcon from '@mui/icons-material/Cached'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import ShareIcon from '@mui/icons-material/Share'

import { TbTruckDelivery } from 'react-icons/tb'

import LoadingFn from '../../components/LoadingFn'

import OrderHeader from '../../components/order/OrderHeader'
import OrderTable from '../../components/order/OrderTable'

export default function CustomerByOrderV3() {
  const { id } = useParams()
  const dispatch = useDispatch()
  let { user } = useSelector((store) => store.user)
  let { order, isLoading, totalQuantity, totalPrice, totalExpressPrice } =
    useSelector((store) => store.saleOrder)
  const [bankAccount, setBankAccount] = useState([])

  const [province, setProvince] = useState([])
  const [amphure, setAmphure] = useState([])
  const [district, setDistrict] = useState([])

  const [selectedProvince, setSelectedProvince] = useState('') // ค่าที่เลือกจังหวัด
  const [selectedAmphure, setSelectedAmphure] = useState('') // ค่าที่เลือกอำเภอ/เขต
  const [selectedDistrict, setSelectedDistrict] = useState('') // ค่าที่เลือกตำบล/แขวง
  const [zipCode, setZipCode] = useState('') // ค่าที่เลือกไปรษณีย์

  const [imageBase64, setImageBase64] = useState('')
  let form = useRef()
  const [isDisabled, setIsDisabled] = useState(true) // สร้าง state สำหรับเก็บสถานะของปุ่ม
  const [open, setOpen] = useState(false)

  // เรียก getOrder เพื่อดึงข้อมูลคำสั่งซื้อ
  useEffect(() => {
    if (id) {
      dispatch(getOrder(id))
    }
  }, [id])

  useEffect(() => {
    if (order && order.vendorId) {
      fetch(`${baseURL}/api/user/bank-account/${order.vendorId}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data)
          setBankAccount(data)
        })
        .catch((error) =>
          toast.error('เกิดข้อผิดพลาดในการดึงข้อมูลบัญชีธนาคาร')
        )
    }
  }, [order.vendorId])

  // คำนวณ totalQuantity, totalPrice, และค่าขนส่ง เมื่อข้อมูล order อัปเดต
  useEffect(() => {
    if (order && order.orders && order.orders.length > 0) {
      dispatch(calculateTotalQuantity())
      dispatch(calculateTotalPrice())
      dispatch(calculateTotalExpressPrice())
      try {
        setImageBase64(order.picture_payment)
        setZipCode(order.postcode) // ตั้งค่าไปรษณีย์
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

  useEffect(() => {
    if (!zipCode) {
      fetch(`${baseURL}/api/province`)
        .then((res) => res.json())
        .then((data) => setProvince(data))
        .catch((error) => toast.error('เกิดข้อผิดพลาดในการดึงรายการจังหวัด'))
    }
  }, [])

  if (isLoading) {
    return <LoadingFn />
  }

  const onChangProvince = (event) => {
    let value = event.target.value
    // console.log('Value :', value)

    setSelectedProvince(value)

    fetch(`${baseURL}/api/province/amphure/${value}`)
      .then((res) => res.json())
      .then((data) => setAmphure(data))
      .catch((error) => toast.error('เกิดข้อผิดพลาดในการค้นหาอำเภอ/เขต'))
  }

  const onChangAmphure = (event) => {
    let value = event.target.value

    setSelectedAmphure(value)

    fetch(`${baseURL}/api/district/amphure/${value}`)
      .then((res) => res.json())
      .then((data) => setDistrict(data))
      .catch((error) => toast.error('เกิดข้อผิดพลาดในการค้นหาตำบล/แขวง'))
  }

  const onChangDistrict = (event) => {
    let value = event.target.value

    setSelectedDistrict(value)

    const selectedDistrictData = district.find((d) => d.id === value) // หาข้อมูลตำบลที่ตรงกับ id

    if (selectedDistrictData) {
      setZipCode(
        selectedDistrictData.zip_code !== '0'
          ? selectedDistrictData.zip_code
          : ''
      ) // ถ้า zip_code เป็น '0' ให้เว้นว่าง
    } else {
      setZipCode('') // ถ้าไม่พบข้อมูลตำบลให้เว้นว่าง
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // ตรวจสอบขนาดไฟล์
      if (file.size > 500 * 1024) {
        // 100 KB
        toast.warning('ไฟล์ต้องมีขนาดไม่เกิน 500 KB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageBase64(reader.result) // เก็บ Base64 ไว้ใน state
      }
      reader.readAsDataURL(file) // อ่านไฟล์เป็น Data URL
    }
  }

  const onEditData = (e) => {
    e.preventDefault(e)
    dispatch(editOrder())
  }

  const cancelPayment = async () => {
    const formData = new FormData()
    formData.append('_id', order._id)
    formData.append('isDelete', true)
    formData.append('updateBy', user.name)

    try {
      await axios.put(`${baseURL}/api/sale-order/reject`, formData, {
        headers: { 'Content-Type': 'application/json' },
      })
      toast.success('ปฎิเสธการชำระเงินสำเร็จ')
      dispatch(getOrder(id))
    } catch (error) {
      console.error(error)
      toast.error('Payment: There was an error!')
    }
  }

  const confirmPayment = async () => {
    try {
      const response = await fetch(`${baseURL}/api/sale-order/complete/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order.orders), // ต้องแปลงเป็น JSON ก่อนส่ง
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      toast.success('อัพเดตสถานะแล้ว')
      dispatch(getOrder(id))
    } catch (error) {
      toast.error('Payment: There was an error!')
      console.error('Error:', error)
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

  const handleClick = () => {
    // คัดลอกข้อความไปยังคลิปบอร์ด
    navigator.clipboard.writeText(order.express).then(() => {
      // แสดง Snackbar หลังคัดลอกสำเร็จ
      setOpen(true)

      // รอสักครู่ก่อนเปลี่ยนไปยังหน้าใหม่ (เช่น 2 วินาทีเพื่อให้ Snackbar แสดงผล)
      setTimeout(() => {
        window.location.href = 'https://th.kerryexpress.com/th/home'
      }, 2000) // รอ 2 วินาทีก่อนเปลี่ยนหน้า
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsDisabled(true)

    const formData = new FormData(form.current)
    formData.append('_id', order._id)
    formData.append('isPayment', true)
    formData.append('picture_payment', imageBase64) // ส่งรูปภาพเป็น Base64

    // ค้นหาชื่อจาก ID ที่เลือก
    const selectedProvinceName =
      province.find((p) => p.id === selectedProvince)?.name_th || ''
    const selectedAmphureName =
      amphure.find((a) => a.id === selectedAmphure)?.name_th || ''
    const selectedDistrictName =
      district.find((d) => d.id === selectedDistrict)?.name_th || ''

    formData.append('province', selectedProvinceName) // เพิ่มชื่อจังหวัด
    formData.append('amphure', selectedAmphureName) // เพิ่มชื่ออำเภอ
    formData.append('district', selectedDistrictName) // เพิ่มชื่อตำบล

    //! Debugging
    // const formEnt = Object.fromEntries(formData.entries())
    // console.log(formEnt)

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
  let df = dt.toISOString().substring(0, 10) // แปลงเป็นรูปแบบ YYYY-MM-DD สำหรับ TextField ใน MUI

  return (
    <div className="container position-relative mt-3 mx-auto">
      <OrderHeader id={id} order={order} bankAccount={bankAccount} />
      <OrderTable
        order={order}
        totalQuantity={totalQuantity}
        totalPrice={totalPrice}
        totalExpressPrice={totalExpressPrice}
      />
      <Paper elevation={3} className="mt-4 p-4">
        <Typography variant="h6" gutterBottom>
          แบบฟอร์มสำหรับกรอกข้อมูล
        </Typography>
        <form onSubmit={handleSubmit} ref={form}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="ชื่อ-นามสกุล"
                fullWidth
                name="name"
                defaultValue={order.name}
                disabled={order.isPayment}
                required
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                label="วันที่สั่งซื้อ"
                type="date"
                name="date_added"
                defaultValue={df}
                disabled
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

            {order.isPayment ? (
              <>
                <Grid item xs={4}>
                  <TextField
                    label="จังหวัด"
                    fullWidth
                    name="province"
                    defaultValue={order.province}
                    disabled={order.isPayment}
                    required
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    label="อำเภอ"
                    fullWidth
                    name="amphure"
                    defaultValue={order.amphure}
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
              </>
            ) : (
              <>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel id="province-select-label">จังหวัด</InputLabel>
                    <Select
                      labelId="province-select-label"
                      id="province-select"
                      // name="province"
                      value={selectedProvince}
                      label="จังหวัด"
                      onChange={(e) => onChangProvince(e)}
                      disabled={order.isPayment}
                    >
                      {province &&
                        province.length > 0 &&
                        province.map((p) => (
                          <MenuItem key={p.id} value={p.id}>
                            {p.name_th}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel id="amphure-select-label">อำเภอ/เขต</InputLabel>
                    <Select
                      labelId="amphure-select-label"
                      id="amphure-select"
                      // name="amphure"
                      value={selectedAmphure}
                      label="อำเภอ/เขต"
                      onChange={(e) => onChangAmphure(e)}
                      disabled={order.isPayment}
                    >
                      {amphure &&
                        amphure.map((a) => (
                          <MenuItem key={a.id} value={a.id}>
                            {a.name_th}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel id="district-select-label">
                      ตำบล/แขวง
                    </InputLabel>
                    <Select
                      labelId="district-select-label"
                      id="district-select"
                      label="ตำบล/แขวง"
                      // name="district"
                      value={selectedDistrict}
                      onChange={(e) => onChangDistrict(e)}
                      disabled={order.isPayment}
                    >
                      {district &&
                        district.map((d) => (
                          <MenuItem key={d.id} value={d.id}>
                            {d.name_th}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            <Grid item xs={6}>
              <TextField
                label="รหัสไปรษณีย์"
                fullWidth
                name="postcode"
                value={zipCode} // เ ใช้ value แทน defaultValue
                disabled={order.isPayment}
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
                  {imageBase64 ? (
                    <Button
                      startIcon={<CachedIcon />}
                      variant="contained"
                      component="span"
                      color="inherit"
                    >
                      อัปโหลดรูปภาพใหม่
                    </Button>
                  ) : (
                    <Button
                      startIcon={<ReceiptLongIcon />}
                      variant="contained"
                      component="span"
                      color="inherit"
                    >
                      อัปโหลดรูปภาพ
                    </Button>
                  )}
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
                  disabled={order.sended}
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
                  ติดตามเลขพัสดุสินค้า &nbsp;
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
                    {order.isPayment && (
                      <>
                        {order.isDelete ? (
                          <Typography
                            sx={{
                              display: 'flex', // ใช้ Flexbox เพื่อจัดเรียง
                              alignItems: 'center', // จัดให้อยู่ตรงกลางในแนวตั้ง
                              textAlign: 'center',
                            }}
                          >
                            ออเดอร์นี้ถูกปฎิเสธ/หมดเวลาการชำระเงิน&nbsp;
                            <ErrorIcon color="error" />
                          </Typography>
                        ) : (
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
                        )}
                      </>
                    )}
                  </>
                )}
              </Grid>
            )}

            {user.role && !order.complete && (
              <>
                {order.isDelete ? (
                  <Grid
                    item
                    xs={12}
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Button type="button" variant="contained" color="error">
                      ปฎิเสธ/หมดเวลา
                    </Button>
                  </Grid>
                ) : (
                  <>
                    <Grid
                      item
                      xs={6}
                      container
                      direction="column"
                      alignItems="start"
                      justifyContent="center"
                    >
                      <Button
                        type="button"
                        variant="contained"
                        color="error"
                        onClick={cancelPayment}
                        startIcon={<CancelIcon />}
                      >
                        ปฎิเสธ
                      </Button>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      container
                      direction="column"
                      alignItems="end"
                      justifyContent="center"
                    >
                      <Button
                        type="button"
                        variant="contained"
                        color="success"
                        onClick={confirmPayment}
                        endIcon={<CheckCircleIcon />}
                      >
                        ยืนยัน
                      </Button>
                    </Grid>
                  </>
                )}
              </>
            )}

            {order.complete && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="เลขติดตามพัสดุสินค้า"
                    fullWidth
                    name="express"
                    defaultValue={order.express}
                    disabled={order.sended}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClick} color="primary">
                            <ShareIcon />
                          </IconButton>
                          <Snackbar
                            message="คัดลอกเลขพัสดุแล้ว"
                            anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'center',
                            }}
                            autoHideDuration={2000}
                            onClose={() => setOpen(false)}
                            open={open}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </>
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
      <br />
      <br />
    </div>
  )
}
