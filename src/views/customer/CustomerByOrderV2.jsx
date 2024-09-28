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
import EditorV2 from '../../components/EditorV2'
import Quill from 'quill'
import CreditScoreIcon from '@mui/icons-material/CreditScore'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import { RiErrorWarningFill } from 'react-icons/ri'
import ErrorIcon from '@mui/icons-material/Error'
import { TfiReload } from 'react-icons/tfi'
import { FaRegArrowAltCircleDown } from 'react-icons/fa'
import { TbTruckDelivery } from 'react-icons/tb'

import {
  getOrder,
  calculateTotalQuantity,
  calculateTotalPrice,
  calculateTotalExpressPrice,
} from '../../redux/saleOrderSlice'
import LoadingFn from '../../components/LoadingFn'

export default function CustomerByOrderV2() {
  const [range, setRange] = useState()
  const dispatch = useDispatch()
  let { user } = useSelector((store) => store.user)
  let { order, isLoading, totalQuantity, totalPrice, totalExpressPrice } =
    useSelector((store) => store.saleOrder)
  // console.log(order.picture_payment)

  const Delta = Quill.import('delta')
  const [image, setImage] = useState(new Delta().insert(''))
  const [readOnly, setReadOnly] = useState(false)
  const [lastChange, setLastChange] = useState()
  const quillRef = useRef()
  const { id } = useParams()

  let form = useRef()
  const [isDisabled, setIsDisabled] = useState(false) // สร้าง state สำหรับเก็บสถานะของปุ่ม

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
        setImage(JSON.parse(order.picture_payment))
      } catch (error) {
        toast.warning('กรุณาแจ้งที่อยู่ / การชำระเงิน')
      }
    }
  }, [order])

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.setContents(image) // ตั้งค่าใหม่ให้กับ Editor
    }
  }, [image]) // เรียกใช้เมื่อ image เปลี่ยนแปลง

  if (isLoading) {
    return <LoadingFn />
  }

  const cancelPayment = async () => {
    const formData = new FormData()
    formData.append('_id', order._id)
    formData.append('isPayment', false)
    formData.append('picture_payment', '')
    setImage('')

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsDisabled(true)

    const formData = new FormData(form.current)
    formData.append('_id', order._id)
    formData.append('isPayment', true)
    formData.append(
      'picture_payment',
      JSON.stringify(quillRef.current?.getContents())
    )

    // const formEnt = Object.fromEntries(formData.entries())
    // console.log(formEnt.picture_payment)

    try {
      await axios.put(`${baseURL}/api/sale-order/j`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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
              <EditorV2
                ref={quillRef}
                readOnly={readOnly}
                onSelectionChange={setRange}
                onTextChange={setLastChange}
                defaultValue={image}
              />
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
              </Grid>
            )}

            {!order.picture_payment && (
              <Grid
                item
                xs={12}
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isDisabled}
                >
                  บันทึก
                </Button>
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
