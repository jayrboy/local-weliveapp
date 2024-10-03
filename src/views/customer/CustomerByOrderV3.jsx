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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

  const { id } = useParams()

  let form = useRef()
  const [isDisabled, setIsDisabled] = useState(true) // สร้าง state สำหรับเก็บสถานะของปุ่ม

  const [imageBase64, setImageBase64] = useState('')

  //! Debugging
  const [province, setProvince] = useState([])
  const [amphure, setAmphure] = useState([])
  const [district, setDistrict] = useState([])

  const [selectedProvince, setSelectedProvince] = useState('') // ค่าที่เลือกจังหวัด
  const [selectedAmphure, setSelectedAmphure] = useState('') // ค่าที่เลือกอำเภอ/เขต
  const [selectedDistrict, setSelectedDistrict] = useState('') // ค่าที่เลือกตำบล/แขวง
  const [zipCode, setZipCode] = useState('') // ค่าที่เลือกไปรษณีย์

  const [bankAccount, setBankAccount] = useState([])

  useEffect(() => {
    if (!zipCode) {
      fetch(`${baseURL}/api/province`)
        .then((res) => res.json())
        .then((data) => setProvince(data))
        .catch((error) => toast.error('เกิดข้อผิดพลาดในการดึงรายการจังหวัด'))
    }
  }, [])

  // เรียก getOrder เพื่อดึงข้อมูลคำสั่งซื้อ
  useEffect(() => {
    if (id) {
      dispatch(getOrder(id))
    }
  }, [id])

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

  if (isLoading) {
    return <LoadingFn />
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

  //TODO (1)
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
          <span className="text-danger">#{id}</span>
          <br />
          {bankAccount &&
            bankAccount.map((b) => (
              <React.Fragment key={b.id}>
                --------------------------------------------
                <br />
                ธนาคาร {b.bank} เลขบัญชี {b.bankID}
                <br />
                ชื่อบัญชี {b.bankName}
                <br />
                <br />
                {b.qrCode ? (
                  <div className="text-center">
                    <img
                      src={b.qrCode}
                      alt="PromptPay"
                      style={{
                        height: '300px', // ความสูงปรับตามสัดส่วน
                        objectFit: 'cover', // ปรับการแสดงผลของรูปภาพ
                      }}
                    />
                  </div>
                ) : (
                  `พร้อมเพย์ ${b.promptPay}`
                )}
                --------------------------------------------
              </React.Fragment>
            ))}
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
                    name="sub_district"
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
